// @ts-check

import { extname, join, resolve } from "path";
import * as fs from "fs/promises";
import { BLOG_TITLE } from "../lib/blog-constants.mjs";

const BLOG_DIRECTORY = "blog";
const BLOG_POST_PAGE_COMPONENT_PATH = resolve(join("src", "lib", "BlogPostPage"));

function parseMarkdownTitle(/** @type {string} */ source) {
  const firstLine = source.split("\n")[0];
  if (firstLine == null) {
    throw new Error("No title.");
  }
  const START = 'export const title = "';
  if (!firstLine.startsWith(START) || !firstLine.endsWith('";')) {
    throw new Error(`Invalid title line:\n${firstLine}`);
  }
  return firstLine.substring(START.length, firstLine.length - 2).trim();
}

/**
 *
 * @param {string} original
 * @returns {Promise<BlogPostMetadata>}
 */
async function computeBlogPostMetadata(/** @type {string} */ original) {
  const withOutExtension = original.substring(0, original.lastIndexOf("."));
  const segments = withOutExtension.split("-");
  const year = segments[0];
  const month = segments[1];
  const date = segments[2];
  if (year == null || month == null || date == null) {
    throw new Error(`Invalid date format in filename: ${original}`);
  }
  const titleSlug = segments.slice(3).join("-");
  const formattedDate = `${year}-${month}-${date}`;
  const permalink = `/blog/${year}/${month}/${date}/${titleSlug}`;

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
      .filter((it) => extname(it) === ".mdx")
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
  join("src", "generator", "generated-metadata.mjs"),
  `// @${"generated"}
// @ts-check
// prettier-ignore
/** @type {readonly BlogPostMetadata[]} */
const generatedMetaDataList = ${JSON.stringify(generatedMetadata, undefined, 2)};
export default generatedMetaDataList;
`,
);

await Promise.all(
  (
    await fs.readdir(join("src", "app", "blog"))
  ).map(async (path) => {
    const fullPath = join("src", "app", "blog", path);
    if ((await fs.stat(fullPath)).isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    }
  }),
);

for (const { permalink } of generatedMetadata) {
  const contentImportPath = resolve(
    join(BLOG_DIRECTORY, `${permalink.split("/").slice(2).join("-")}.mdx`),
  );
  const generatedSource = `// @${"generated"}
import React from 'react';
import BlogPostPage from '${BLOG_POST_PAGE_COMPONENT_PATH}';
import Content from '${contentImportPath}';
import * as MdxExports from '${contentImportPath}';

const OG_IMAGE = 'ogImage';

export const metadata = {
  title: \`\${MdxExports.title} | ${BLOG_TITLE}\`,
  openGraph: {
    type: "article",
    title: \`\${MdxExports.title} | ${BLOG_TITLE}\`,
    images: MdxExports[OG_IMAGE],
  },
};

export default () => <BlogPostPage content={Content} permalink="${permalink}" />;
`;
  const directory = join("src", "app", permalink.substring(1));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(join(directory, "page.jsx"), generatedSource);
}
