import { dirname, extname, join } from 'path';

import type { Metadata } from '../components/blog-types';
import parseMarkdownHeaderTree, {
  MarkdownTablesOfContentsElement,
} from '../utils/markdown-header-parser';

import mainRunner, { utils } from 'esbuild-scripts/api';
import { checkNotNull } from 'lib-common';

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
  const compiledReactCode = await utils.compileMarkdownToReact(source);
  return `${compiledReactCode}
MDXContent.metadata = ${JSON.stringify(metadata, undefined, 2)};
MDXContent.toc = ${JSON.stringify(toc, undefined, 2)};
`;
};

const processBlogPosts = async (): Promise<BlogPostParsedData[]> =>
  await Promise.all(
    (
      await utils.fs.readDirectory(BLOG_DIRECTORY, true)
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

        const content = await utils.fs.readFile(join('blog', original));
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
        utils.fs.writeFile(
          join(GENERATED_COMPONENTS_DIRECTORY, `${parsed.withOutExtension}__FULL.jsx`),
          fullReactComponentCode
        ),
        utils.fs.writeFile(
          join(GENERATED_COMPONENTS_DIRECTORY, `${parsed.withOutExtension}__TRUNCATED.jsx`),
          truncatedReactComponentCode
        ),
      ]);
    })
  );
};

const writeGeneratedHomePage = async (
  siteTitle: string,
  blogPostParsedDataList: readonly BlogPostParsedData[]
) => {
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
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${imports}

const items = [
${contentProps}];

const Page = () => <BlogListPage siteTitle=${JSON.stringify(siteTitle)} items={items} />;
export default Page;
`;
  await utils.fs.writeFile(
    join(utils.constants.GENERATED_PAGES_PATH, `index.jsx`),
    homepageListCode
  );
};

const writeGeneratedBlogPostPages = async (
  siteTitle: string,
  blogPostParsedDataList: readonly BlogPostParsedData[]
) => {
  await Promise.all(
    blogPostParsedDataList.map(async (parsed) => {
      const path = join(utils.constants.GENERATED_PAGES_PATH, `${parsed.path}.jsx`);
      await utils.fs.ensureDirectory(dirname(path));
      await utils.fs.writeFile(
        path,
        `import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '../../../../../generated-components/${parsed.withOutExtension}__FULL';
const Page = () => <BlogPostPage siteTitle=${JSON.stringify(siteTitle)} content={Content} />;
export default Page;
`
      );
    })
  );
};

const generateBlogPages = (): Promise<void> =>
  mainRunner(async () => {
    const siteTitle = JSON.parse(await utils.fs.readFile('package.json')).blogTitle || 'Blog';
    if (typeof siteTitle !== 'string') {
      // eslint-disable-next-line no-console
      console.error(
        `Invalid site title: ${siteTitle}. Expecting a string field blogTitle in package.json`
      );
      process.exit(1);
    }
    await utils.fs.ensureDirectory(BLOG_DIRECTORY);
    await utils.fs.ensureDirectory(GENERATED_COMPONENTS_DIRECTORY);
    await utils.fs.emptyDirectory(GENERATED_COMPONENTS_DIRECTORY);
    await utils.fs.ensureDirectory(utils.constants.GENERATED_PAGES_PATH);
    await utils.fs.emptyDirectory(utils.constants.GENERATED_PAGES_PATH);
    const blogPostParsedDataList = (await processBlogPosts()).sort((a, b) =>
      b.original.localeCompare(a.original)
    );
    await Promise.all([
      writeGeneratedReactComponents(blogPostParsedDataList),
      writeGeneratedHomePage(siteTitle, blogPostParsedDataList),
      writeGeneratedBlogPostPages(siteTitle, blogPostParsedDataList),
    ]);
  });

export default generateBlogPages;
