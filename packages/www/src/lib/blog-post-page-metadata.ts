import type { Metadata } from "next";
import { BLOG_TITLE } from "./blog-constants";

export default function blogPostPageMetadata(title: string, ogImage?: string): Metadata {
  return {
    title: `${title} | ${BLOG_TITLE}`,
    openGraph: {
      type: "article",
      title: `${title} | ${BLOG_TITLE}`,
      images: ogImage,
    },
  };
}
