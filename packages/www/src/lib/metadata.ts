// @ts-check

import * as fs from "fs";
import { extname, join } from "path";

const BLOG_DIRECTORY = "blog";

function parseMarkdownTitle(source: string) {
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

function computeBlogPostMetadata(original: string): BlogPostMetadata {
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

  const content = fs.readFileSync(join(BLOG_DIRECTORY, original)).toString();
  try {
    const title = parseMarkdownTitle(content);
    return { title, formattedDate, permalink, year, month, date, titleSlug };
  } catch (error) {
    throw new Error(`Failed to parse ${original}, error: ${error}`);
  }
}

function computeAllMedatada(): readonly BlogPostMetadata[] {
  const metadataList = fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((it) => extname(it) === ".mdx")
    .map((it) => ({ ...computeBlogPostMetadata(it) }));
  metadataList.sort((a, b) => b.permalink.localeCompare(a.permalink));
  metadataList.forEach((item, i) => {
    item.prevPermalink = metadataList[i - 1]?.permalink;
    item.nextPermalink = metadataList[i + 1]?.permalink;
  });
  return metadataList;
}

const allMetadata: readonly BlogPostMetadata[] = computeAllMedatada();
export default allMetadata;
