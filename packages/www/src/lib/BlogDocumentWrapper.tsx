import CommonHeader from "esbuild-scripts/components/CommonHeader";
import { useLocation } from "esbuild-scripts/components/router-hooks";
import type { ReactNode } from "react";
import NavBar from "./NavBar";
import { BLOG_TITLE, BLOG_URL } from "./blog-constants";

export default function BlogDocumentWrapper({ children }: { children: ReactNode }): JSX.Element {
  let path = useLocation().pathname;
  if (path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }

  return (
    <>
      <CommonHeader
        title="Developer Sam Blog"
        description="Developer Sam's Blog"
        shortcutIcon="/logo.png"
        ogAuthor="Developer Sam"
        ogURL={`${BLOG_URL}${path}`}
        gaId="G-K50MLQ68K6"
      />
      <NavBar title={BLOG_TITLE} titleLink="/blog" navItems={[{ name: "Home", link: "/" }]} />
      <div className="lg:max-w-screen-lg my-8 mx-auto">{children}</div>
    </>
  );
}
