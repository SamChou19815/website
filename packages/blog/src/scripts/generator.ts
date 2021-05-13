import { dirname, extname, join } from 'path';

import type { Metadata } from '../components/types';

import mainRunner from 'esbuild-scripts/api';
import { GENERATED_PAGES_PATH } from 'esbuild-scripts/utils/constants';
import compileMarkdownToReact from 'esbuild-scripts/utils/mdx';
import { checkNotNull } from 'lib-common';
import { emptyDirectory, ensureDirectory, readDirectory, readFile, writeFile } from 'lib-fs';
import parseMarkdownHeaderTree, {
  MarkdownTablesOfContentsElement,
} from 'lib-markdown-header-parser';

type BlogPostParsedData = {
  readonly original: string;
  readonly withOutExtension: string;
  readonly date: string;
  readonly formattedDate: string;
  readonly path: string;
  readonly permalink: string;
  readonly title: string;
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  readonly content: string;
};

const BLOG_DIRECTORY = 'blog';
const GENERATED_COMPONENTS_DIRECTORY = 'generated-components';

const compileMarkdownToReactWithAttachedData = async (
  source: string,
  metadata: Metadata,
  toc: readonly MarkdownTablesOfContentsElement[]
) => {
  const compiledReactCode = await compileMarkdownToReact(source);
  return `${compiledReactCode}
MDXContent.metadata = ${JSON.stringify(metadata, undefined, 2)};
MDXContent.toc = ${JSON.stringify(toc, undefined, 2)};
`;
};

const processBlogPosts = async (): Promise<BlogPostParsedData[]> =>
  await Promise.all(
    (
      await readDirectory(BLOG_DIRECTORY, true)
    )
      .filter((it) => {
        switch (extname(it)) {
          case '.md':
          case '.mdx':
            return true;
          default:
            return false;
        }
      })
      .map(async (original) => {
        const withOutExtension = original.substring(0, original.lastIndexOf('.'));
        const segments = withOutExtension.split('-');
        const year = checkNotNull(segments[0]);
        const month = checkNotNull(segments[1]);
        const date = checkNotNull(segments[2]);
        const titleSlug = segments.slice(3).join('-');
        const formattedDate = `${year}-${month}-${date}`;
        const dateString = new Date(formattedDate).toISOString();
        const permalink = `/${year}/${month}/${date}/${titleSlug}`;

        const content = await readFile(join('blog', original));
        try {
          const { label: title, children: toc } = parseMarkdownHeaderTree(content);
          return {
            original,
            withOutExtension,
            date: dateString,
            formattedDate,
            path: join(year, month, date, titleSlug),
            permalink,
            title,
            toc,
            content,
          };
        } catch (error) {
          throw new Error(`Failed to parse ${original}, error: ${error.message}`);
        }
      })
  );

const writeGeneratedReactComponents = async (
  blogPostParsedDataList: readonly BlogPostParsedData[]
) => {
  await Promise.all(
    blogPostParsedDataList.map(async (parsed, index) => {
      const contentLinesWithoutTitle = parsed.content.trim().split('\n').slice(1);
      const contentWithoutTitle = contentLinesWithoutTitle.join('\n');
      const truncateIndex = contentLinesWithoutTitle.findIndex(
        (it) => it.trimStart().startsWith('<!--') && it.includes('truncate')
      );
      const truncatedContentWithoutTitle = contentLinesWithoutTitle
        .slice(0, truncateIndex)
        .join('\n');
      const fullPrevItem = blogPostParsedDataList[index - 1];
      const fullNextItem = blogPostParsedDataList[index + 1];
      const prevItem =
        fullPrevItem != null
          ? { title: fullPrevItem.title, permalink: fullPrevItem.permalink }
          : undefined;
      const nextItem =
        fullNextItem != null
          ? { title: fullNextItem.title, permalink: fullNextItem.permalink }
          : undefined;
      const metadataCommon: Omit<Metadata, 'truncated'> = {
        title: parsed.title,
        date: parsed.date,
        formattedDate: parsed.formattedDate,
        permalink: parsed.permalink,
        nextItem,
        prevItem,
      };
      const [fullReactComponentCode, truncatedReactComponentCode] = await Promise.all([
        compileMarkdownToReactWithAttachedData(
          contentWithoutTitle,
          { ...metadataCommon, truncated: false },
          parsed.toc
        ),
        compileMarkdownToReactWithAttachedData(
          truncatedContentWithoutTitle,
          { ...metadataCommon, truncated: true },
          parsed.toc
        ),
      ]);
      await Promise.all([
        writeFile(
          join(GENERATED_COMPONENTS_DIRECTORY, `${parsed.withOutExtension}__FULL.jsx`),
          fullReactComponentCode
        ),
        writeFile(
          join(GENERATED_COMPONENTS_DIRECTORY, `${parsed.withOutExtension}__TRUNCATED.jsx`),
          truncatedReactComponentCode
        ),
      ]);
    })
  );
};

const writeGeneratedHomePage = async (blogPostParsedDataList: readonly BlogPostParsedData[]) => {
  const imports = blogPostParsedDataList
    .map(
      ({ withOutExtension }, index) =>
        `import Component${index} from '../../generated-components/${withOutExtension}__TRUNCATED';`
    )
    .join('\n');
  const contentProps = blogPostParsedDataList
    .map((_, index) => `  { content: Component${index} },\n`)
    .join('');
  const homepageListCode = `// @${'generated'}
  import React from 'react';
  import BlogListPage from '../components/BlogListPage';
  ${imports}

  const items = [
  ${contentProps}];

  const Page = () => <BlogListPage items={items} />;
  export default Page;
  `;
  await writeFile(join(GENERATED_PAGES_PATH, `index.jsx`), homepageListCode);
};

const writeGeneratedBlogPostPages = async (
  blogPostParsedDataList: readonly BlogPostParsedData[]
) => {
  await Promise.all(
    blogPostParsedDataList.map(async (parsed) => {
      const path = join(GENERATED_PAGES_PATH, `${parsed.path}.jsx`);
      await ensureDirectory(dirname(path));
      await writeFile(
        path,
        `import React from 'react';
import Content from '../../../../../generated-components/${parsed.withOutExtension}__FULL';
import BlogPostPage from '../../../../components/BlogPostPage';
const Page = () => <BlogPostPage content={Content} />;
export default Page;
`
      );
    })
  );
};

const generateBlogPages = async () => {
  await ensureDirectory(BLOG_DIRECTORY);
  await ensureDirectory(GENERATED_COMPONENTS_DIRECTORY);
  await emptyDirectory(GENERATED_COMPONENTS_DIRECTORY);
  await ensureDirectory(GENERATED_PAGES_PATH);
  await emptyDirectory(GENERATED_PAGES_PATH);
  const blogPostParsedDataList = (await processBlogPosts()).sort((a, b) =>
    b.original.localeCompare(a.original)
  );
  await Promise.all([
    writeGeneratedReactComponents(blogPostParsedDataList),
    writeGeneratedHomePage(blogPostParsedDataList),
    writeGeneratedBlogPostPages(blogPostParsedDataList),
  ]);
};

if (process.argv.includes('--compile-only')) {
  generateBlogPages();
} else {
  mainRunner(() => generateBlogPages());
}
