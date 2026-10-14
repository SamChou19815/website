import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_terminal/")({
  head: () => ({ meta: [{ title: "Developer Sam — Terminal" }] }),
});
