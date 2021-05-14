import { dirname, extname, join, resolve } from 'path';

import type { Metadata } from '../components/blog-types';

import { constants, utils } from 'esbuild-scripts/api';
import { checkNotNull } from 'lib-common';

const BLOG_DIRECTORY = 'blog';

const processBlogPostsPerFile = async () =>
  await Promise.all(
    (
      await utils.readDirectory(BLOG_DIRECTORY, true)
    )
      .filter((it) => extname(it) === '.md')
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

        const content = await utils.readFile(join(BLOG_DIRECTORY, original));
        try {
          const title = utils.parseMarkdownTitle(content);
          return {
            original,
            withOutExtension,
            date: dateString,
            formattedDate,
            path: join(year, month, date, titleSlug),
            permalink,
            title,
          };
        } catch (error) {
          throw new Error(`Failed to parse ${original}, error: ${error.message}`);
        }
      })
  );

const processBlogPosts = async () => {
  const perFileData = await processBlogPostsPerFile();
  return perFileData.map((parsed, index) => {
    const { original, date, formattedDate, path, permalink } = parsed;
    const fullPrevItem = perFileData[index - 1];
    const fullNextItem = perFileData[index + 1];

    const metadata: Metadata = {
      date,
      formattedDate,
      permalink,
      nextItem:
        fullNextItem != null
          ? { title: fullNextItem.title, permalink: fullNextItem.permalink }
          : undefined,
      prevItem:
        fullPrevItem != null
          ? { title: fullPrevItem.title, permalink: fullPrevItem.permalink }
          : undefined,
    };
    const metadataString = JSON.stringify(metadata);
    return { original, path, metadataString };
  });
};

type BlogPostProcessedData = {
  readonly original: string;
  readonly path: string;
  readonly metadataString: string;
};

const writeGeneratedReactComponents = async (
  siteTitleString: string,
  blogPostParsedDataList: readonly BlogPostProcessedData[]
) => {
  await Promise.all(
    blogPostParsedDataList.map(async (parsed) => {
      const { original, metadataString } = parsed;
      const resovledOriginal = resolve(join(BLOG_DIRECTORY, original));

      const blogPostPagePath = join(constants.GENERATED_PAGES_PATH, `${parsed.path}.jsx`);
      await utils.ensureDirectory(dirname(blogPostPagePath));

      await utils.writeFile(
        blogPostPagePath,
        `import React from 'react';
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '${resovledOriginal}';
const Page = () => <BlogPostPage siteTitle=${siteTitleString} content={Content} metadata={${metadataString}} />;
export default Page;
`
      );
    })
  );
};

const writeGeneratedHomePage = async (
  siteTitleString: string,
  blogPostParsedDataList: readonly BlogPostProcessedData[]
) => {
  const contentImports = blogPostParsedDataList
    .map(
      ({ original }, index) =>
        `import Component${index} from '../../blog/${original}?truncated=true';`
    )
    .join('\n');
  const contentProps = blogPostParsedDataList
    .map(
      ({ metadataString }, index) =>
        `  { content: Component${index}, metadata: ${metadataString} },\n`
    )
    .join('');
  const homepageListCode = `// @${'generated'}
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${contentImports}

const items = [
${contentProps}];

const Page = () => <BlogListPage siteTitle=${siteTitleString} items={items} />;
export default Page;
`;
  await utils.writeFile(join(constants.GENERATED_PAGES_PATH, `index.jsx`), homepageListCode);
};

const generateBlogPages = async (siteTitle: string): Promise<void> => {
  await utils.ensureDirectory(BLOG_DIRECTORY);
  await utils.ensureDirectory(constants.GENERATED_PAGES_PATH);
  await utils.emptyDirectory(constants.GENERATED_PAGES_PATH);
  const blogPostParsedDataList = (await processBlogPosts()).sort((a, b) =>
    b.original.localeCompare(a.original)
  );
  const siteTitleString = JSON.stringify(siteTitle);
  await Promise.all([
    writeGeneratedReactComponents(siteTitleString, blogPostParsedDataList),
    writeGeneratedHomePage(siteTitleString, blogPostParsedDataList),
  ]);
};

export default generateBlogPages;
