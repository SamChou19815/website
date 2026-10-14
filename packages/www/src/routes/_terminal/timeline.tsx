import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_terminal/timeline")({
  head: () => ({ meta: [{ title: "Timeline | Developer Sam" }] }),
});
