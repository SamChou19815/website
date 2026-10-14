import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_terminal/about")({
  head: () => ({ meta: [{ title: "About | Developer Sam" }] }),
});
