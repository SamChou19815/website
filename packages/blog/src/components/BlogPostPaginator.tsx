import Link from 'esbuild-scripts/components/Link';
import React from 'react';
import type { BlogPaginationItem } from './blog-types';

type PaginationNavItemProps = { readonly item: BlogPaginationItem; readonly isLeft: boolean };
function PaginationNavItem({ item, isLeft }: PaginationNavItemProps): JSX.Element {
  return (
    <Link
      className="flex-grow rounded-md border border-solid border-gray-300 p-4 leading-tight hover:border-blue-500"
      to={item.permalink}
    >
      <div className="mb-1 text-sm font-medium text-gray-500">
        {isLeft ? 'Newer Post' : 'Older Post'}
      </div>
      <div className="break-words font-bold">{isLeft ? `« ${item.title}` : `${item.title} »`}</div>
    </Link>
  );
}

type Props = { readonly nextItem?: BlogPaginationItem; readonly prevItem?: BlogPaginationItem };
export default function BlogPostPaginator({ nextItem, prevItem }: Props): JSX.Element {
  return (
    <nav className="flex" aria-label="Blog post page navigation">
      <div className="flex flex-1">{prevItem && <PaginationNavItem item={prevItem} isLeft />}</div>
      <div className="ml-4 flex flex-1 text-right">
        {nextItem && <PaginationNavItem item={nextItem} isLeft={false} />}
      </div>
    </nav>
  );
}
