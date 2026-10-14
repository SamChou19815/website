import { createFileRoute } from "@tanstack/react-router";
import { BLOG_TITLE } from "../../../lib/blog-constants";
import { allMetadata, isExternalPost, permalinkFromMetadata } from "../../../lib/metadata";

const localPosts = allMetadata.filter((post) => !isExternalPost(post));

// Each local post is prerendered at its permalink (see `vite.config.ts`). The
// prose itself is compiled into the wasm binary from `src/blog-posts` by
// `crates/sam-web/build.rs`.
export const Route = createFileRoute("/_terminal/blog/$")({
  head: ({ params: { _splat: slug } }) => {
    const permalink = `/blog/${slug}`;
    const post = localPosts.find((it) => permalinkFromMetadata(it) === permalink);
    if (post == null) return {};
    const title = `${post.title} | ${BLOG_TITLE}`;
    return {
      meta: [
        { title },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
      ],
    };
  },
});
