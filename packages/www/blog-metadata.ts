import fs from "node:fs";
import path from "node:path";
import type { BlogPostMetadata } from "./src/lib/metadata.ts";

/**
 * The post's frontmatter: a `---` fenced block of `key: "value"` lines at the
 * very top of the file. Only `title` lives there, so a hand-rolled reader is
 * enough and the site keeps no YAML dependency.
 * `crates/sam-web/build.rs` parses the same block for the wasm site.
 */
function parseFrontmatter(source: string, fullPath: string): Record<string, string> {
  const lines = source.split("\n");
  if (lines[0] !== "---") {
    throw new Error(`${fullPath}: expected a --- frontmatter fence on the first line.`);
  }
  const fields: Record<string, string> = {};
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index];
    if (line === "---") {
      if (fields.title == null) {
        throw new Error(`${fullPath}: the frontmatter has no title.`);
      }
      return fields;
    }
    const match = /^([a-z]+): "(.*)"$/.exec(line ?? "");
    if (match == null) {
      throw new Error(`${fullPath}: invalid frontmatter line:\n${line}`);
    }
    fields[match[1] as string] = match[2] as string;
  }
  throw new Error(`${fullPath}: the frontmatter fence is never closed.`);
}

/**
 * Read at build time by `vite.config.ts`, which inlines the result as
 * `process.env.ALL_BLOG_POST_METADATA` and prerenders a page per local post.
 */
export function computeAllMetadata(): BlogPostMetadata[] {
  const BLOG_POSTS_ROOT = path.join("src", "blog-posts");

  const allMetadata: BlogPostMetadata[] = [];

  const externalPosts: Omit<BlogPostMetadata, "titleSlug">[] = JSON.parse(
    fs.readFileSync(path.join("src", "external-blog-posts.json")).toString(),
  );
  for (const post of externalPosts) {
    if (post.externalUrl == null) {
      throw new Error(`External blog post "${post.title}" is missing an externalUrl.`);
    }
    allMetadata.push({ titleSlug: "", ...post });
  }

  for (const year of fs.readdirSync(BLOG_POSTS_ROOT)) {
    for (const month of fs.readdirSync(path.join(BLOG_POSTS_ROOT, year))) {
      for (const date of fs.readdirSync(path.join(BLOG_POSTS_ROOT, year, month))) {
        for (const file of fs.readdirSync(path.join(BLOG_POSTS_ROOT, year, month, date))) {
          const fullPath = path.join(BLOG_POSTS_ROOT, year, month, date, file);
          const { title } = parseFrontmatter(fs.readFileSync(fullPath).toString(), fullPath);
          allMetadata.push({
            title: title as string,
            year,
            month,
            date,
            titleSlug: path.basename(file, ".md"),
          });
        }
      }
    }
  }

  allMetadata.sort((a, b) => {
    let c = b.year.localeCompare(a.year);
    if (c !== 0) return c;
    c = b.month.localeCompare(a.month);
    if (c !== 0) return c;
    c = b.date.localeCompare(a.date);
    return c;
  });

  return allMetadata;
}
