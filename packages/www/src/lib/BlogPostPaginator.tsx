import Link from "esbuild-scripts/components/Link";
import generatedMetadata from "../generator/generated-metadata.mjs";

type PaginationNavItemProps = {
  readonly permalink: string;
  readonly isLeft: boolean;
};

function PaginationNavItem({ permalink, isLeft }: PaginationNavItemProps): JSX.Element {
  const metadata = generatedMetadata.find((it) => it.permalink === permalink);
  if (metadata == null) {
    throw permalink;
  }

  return (
    <Link
      className="flex-grow rounded-md border border-solid border-gray-300 p-4 leading-tight hover:border-blue-500"
      to={permalink}
    >
      <div className="mb-1 text-sm font-medium text-gray-500">
        {isLeft ? "Newer Post" : "Older Post"}
      </div>
      <div className="break-words font-bold">
        {isLeft ? `« ${metadata.title}` : `${metadata.title} »`}
      </div>
    </Link>
  );
}

type Props = {
  readonly nextPermalink?: string;
  readonly prevPermalink?: string;
};
export default function BlogPostPaginator({ nextPermalink, prevPermalink }: Props): JSX.Element {
  return (
    <nav className="flex" aria-label="Blog post page navigation">
      <div className="flex flex-1">
        {prevPermalink && <PaginationNavItem permalink={prevPermalink} isLeft={true} />}
      </div>
      <div className="ml-4 flex flex-1 text-right">
        {nextPermalink && <PaginationNavItem permalink={nextPermalink} isLeft={false} />}
      </div>
    </nav>
  );
}
