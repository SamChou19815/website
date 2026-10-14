import { createFileRoute } from "@tanstack/react-router";
import { BLOG_TITLE } from "../../../lib/blog-constants";

export const Route = createFileRoute("/_terminal/blog/")({
  head: () => ({ meta: [{ title: BLOG_TITLE }] }),
});
