import { extname, join, resolve } from 'path';

import { utils } from 'esbuild-scripts/api';

import type { Metadata } from '../components/blog-types';

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
          throw new Error(`Failed to parse ${original}, error: ${error}`);
        }
      })
  );

const processBlogPosts = async () => {
  const perFileData = await processBlogPostsPerFile();
  return perFileData.map((parsed, index) => {
    const { original, date, formattedDate, path, permalink } = parsed;
    const fullPrevItem = perFileData[index + 1];
    const fullNextItem = perFileData[index - 1];

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
import BlogPostPage from 'lib-react-docs/components/BlogPostPage';
import Content from '${resovledOriginal}';
const Page = () => <BlogPostPage siteTitle=${siteTitleString} content={Content} metadata={${metadataString}} />;
export default Page;
`,
    ];
  });

const generatedHomePageCode = (
  siteTitleString: string,
  blogPostParsedDataList: readonly BlogPostProcessedData[]
): string => {
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
  return `// @${'generated'}
import React from 'react';
import BlogListPage from 'lib-react-docs/components/BlogListPage';
${contentImports}

const items = [
${contentProps}];

const Page = () => <BlogListPage siteTitle=${siteTitleString} items={items} />;
export default Page;
`;
};

const generateBlogPagesVirtualEntryComponents = async (
  siteTitle: string
): Promise<Readonly<Record<string, string>>> => {
  await utils.ensureDirectory(BLOG_DIRECTORY);
  const blogPostParsedDataList = (await processBlogPosts()).sort((a, b) =>
    b.original.localeCompare(a.original)
  );
  const siteTitleString = JSON.stringify(siteTitle);
  return Object.fromEntries([
    ...generatedBlogPagesCode(siteTitleString, blogPostParsedDataList),
    ['index', generatedHomePageCode(siteTitleString, blogPostParsedDataList)],
  ]);
};

export default generateBlogPagesVirtualEntryComponents;
