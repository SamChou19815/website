import * as fs from 'fs/promises';
import { extname, join, resolve } from 'path';

import mainRunner from 'esbuild-scripts/api';

import type { Metadata } from './src/components/blog-types';
import { BLOG_TITLE } from './src/constants';

const BLOG_DIRECTORY = 'blog';

const BLOG_LIST_PAGE_COMPONENT_PATH = resolve(join('src', 'components', 'BlogListPage'));
const BLOG_POST_PAGE_COMPONENT_PATH = resolve(join('src', 'components', 'BlogPostPage'));

function parseMarkdownTitle(source: string): string {
  const firstLine = source.split('\n')[0];
  if (firstLine == null) throw new Error(`No title.`);
  if (!firstLine.startsWith('#')) throw new Error(`Invalid title line:\n${firstLine}`);
  return firstLine.substring(1).trim();
}

const processBlogPostsPerFile = async () =>
  await Promise.all(
    (
      await fs.readdir(BLOG_DIRECTORY)
    )
      .filter((it) => extname(it) === '.md')
      .map(async (original) => {
        const withOutExtension = original.substring(0, original.lastIndexOf('.'));
        const segments = withOutExtension.split('-');
        const year = segments[0];
        const month = segments[1];
        const date = segments[2];
        if (year == null || month == null || date == null) {
          throw new Error(`Invalid date format in filename: ${original}`);
        }
        const titleSlug = segments.slice(3).join('-');
        const formattedDate = `${year}-${month}-${date}`;
        const dateString = new Date(formattedDate).toISOString();
        const permalink = `/${year}/${month}/${date}/${titleSlug}`;

        const content = (await fs.readFile(join(BLOG_DIRECTORY, original))).toString();
        try {
          const title = parseMarkdownTitle(content);
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
          throw new Error(`Failed to parse ${original}, error: ${error}`);
        }
      })
  );

async function processBlogPosts() {
  const perFileData = await processBlogPostsPerFile();
  return perFileData.map((parsed, index) => {
    const { original, date, formattedDate, path, permalink, title } = parsed;
    const fullPrevItem = perFileData[index + 1];
    const fullNextItem = perFileData[index - 1];

    const metadata: Metadata = {
      title,
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
}

type BlogPostProcessedData = {
  readonly original: string;
  readonly path: string;
  readonly metadataString: string;
};

const generatedBlogPagesCode = (
  siteTitleString: string,
  blogPostParsedDataList: readonly BlogPostProcessedData[]
): readonly (readonly [string, string])[] =>
  blogPostParsedDataList.map((parsed) => {
    const { original, metadataString } = parsed;
    const resovledOriginal = resolve(join(BLOG_DIRECTORY, original));

    return [
      parsed.path,
      `import React from 'react';
import BlogPostPage from '${BLOG_POST_PAGE_COMPONENT_PATH}';
import Content from '${resovledOriginal}';
const Page = () => <BlogPostPage siteTitle=${siteTitleString} content={Content} metadata={${metadataString}} />;
export default Page;
`,
    ];
  });

function generatedHomePageCode(
  siteTitleString: string,
  blogPostParsedDataList: readonly BlogPostProcessedData[]
): string {
  const contentProps = blogPostParsedDataList
    .map(({ metadataString }) => `  ${metadataString},\n`)
    .join('');
  return `// @${'generated'}
import React from 'react';
import BlogListPage from '${BLOG_LIST_PAGE_COMPONENT_PATH}';

const items = [
${contentProps}];

const Page = () => <BlogListPage siteTitle=${siteTitleString} items={items} />;
export default Page;
`;
}

mainRunner(async () => {
  await fs.mkdir(BLOG_DIRECTORY, { recursive: true });
  const blogPostParsedDataList = (await processBlogPosts()).sort((a, b) =>
    b.original.localeCompare(a.original)
  );
  const siteTitleString = JSON.stringify(BLOG_TITLE);
  return Object.fromEntries([
    ...generatedBlogPagesCode(siteTitleString, blogPostParsedDataList),
    ['index', generatedHomePageCode(siteTitleString, blogPostParsedDataList)],
  ]);
});
