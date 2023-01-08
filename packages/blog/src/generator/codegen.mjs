// @ts-check

import * as fs from 'fs/promises';
import { extname, join, resolve } from 'path';

const BLOG_DIRECTORY = 'blog';
const BLOG_POST_PAGE_COMPONENT_PATH = resolve(join('src', 'components', 'BlogPostPage'));

function parseMarkdownTitle(/** @type {string} */ source) {
  const firstLine = source.split('\n')[0];
  if (firstLine == null) {
    throw new Error('No title.');
  }
  if (!firstLine.startsWith('#')) {
    throw new Error(`Invalid title line:\n${firstLine}`);
  }
  return firstLine.substring(1).trim();
}

/**
 *
 * @param {string} original
 * @returns {Promise<BlogPostMetadata>}
 */
async function computeBlogPostMetadata(/** @type {string} */ original) {
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
  const permalink = `/${year}/${month}/${date}/${titleSlug}`;

  const content = (await fs.readFile(join(BLOG_DIRECTORY, original))).toString();
  try {
    const title = parseMarkdownTitle(content);
    return { title, formattedDate, permalink };
  } catch (error) {
    throw new Error(`Failed to parse ${original}, error: ${error}`);
  }
}

/** @returns {Promise<BlogPostMetadata[]>} */
async function computeAllMedatada() {
  const metadataList = await Promise.all(
    (
      await fs.readdir(BLOG_DIRECTORY)
    )
      .filter((it) => extname(it) === '.md')
      .map(async (it) => ({ ...(await computeBlogPostMetadata(it)) })),
  );
  metadataList.sort((a, b) => b.permalink.localeCompare(a.permalink));
  metadataList.forEach((item, i) => {
    item.prevPermalink = metadataList[i - 1]?.permalink;
    item.nextPermalink = metadataList[i + 1]?.permalink;
  });
  return metadataList;
}

const generatedMetadata = await computeAllMedatada();

await fs.writeFile(
  join('src', 'generator', 'generated-metadata.mjs'),
  `// @${'generated'}
// @ts-check
// prettier-ignore
/** @type {readonly BlogPostMetadata[]} */
const generatedMetaDataList = ${JSON.stringify(generatedMetadata, undefined, 2)};
export default generatedMetaDataList;
`,
);

await Promise.all(
  (
    await fs.readdir(join('src', 'pages'))
  ).map(async (path) => {
    const fullPath = join('src', 'pages', path);
    if ((await fs.stat(fullPath)).isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    }
  }),
);

for (const { permalink } of generatedMetadata) {
  const contentImportPath = resolve(
    join(BLOG_DIRECTORY, `${permalink.split('/').slice(1).join('-')}.md`),
  );
  const generatedSource = `// @${'generated'}
import React from 'react';
import BlogPostPage from '${BLOG_POST_PAGE_COMPONENT_PATH}';
import Content from '${contentImportPath}';

export default () => <BlogPostPage content={Content} permalink="${permalink}" />;
`;
  const directory = join('src', 'pages', permalink.substring(1));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(join(directory, 'index.jsx'), generatedSource);
}
