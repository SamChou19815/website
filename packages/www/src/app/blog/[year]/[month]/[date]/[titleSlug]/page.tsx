import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import { BLOG_TITLE } from "../../../../../../lib/blog-constants.mjs";
import Components from "../../../../../../lib/blog-post-mdx-components";
import allMetadata from "../../../../../../lib/metadata";

export type BlogPostPageParams = {
  readonly year: string;
  readonly month: string;
  readonly date: string;
  readonly titleSlug: string;
};

export async function generateStaticParams(): Promise<BlogPostPageParams[]> {
  return allMetadata.map(({ year, month, date, titleSlug }) => ({
    year,
    month,
    date,
    titleSlug,
  }));
}

export async function generateMetadata(
  { params }: { readonly params: BlogPostPageParams },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const OG_IMAGE = "ogImage";
  const permalink = `/blog/${params.year}/${params.month}/${params.date}/${params.titleSlug}`;
  const componentThunk = Components[permalink];
  if (componentThunk == null) throw permalink;
  const Component = await componentThunk();

  return {
    title: `${Component.title} | ${BLOG_TITLE}`,
    openGraph: {
      type: "article",
      title: `${Component.title} | ${BLOG_TITLE}`,
      images: Component[OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({
  params,
}: { readonly params: BlogPostPageParams }): Promise<JSX.Element> {
  const permalink = `/blog/${params.year}/${params.month}/${params.date}/${params.titleSlug}`;
  const componentThunk = Components[permalink];
  if (componentThunk == null) throw permalink;
  const { default: BlogPostContents } = await componentThunk();
  return <BlogPostContents />;
}
