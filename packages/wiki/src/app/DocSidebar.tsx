// Forked from https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocSidebar/index.tsx

/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */

import clsx from 'clsx';
import React, { useState, ReactElement } from 'react';

import Link from 'esbuild-scripts/components/Link';

type SidebarItemLink = {
  readonly type: 'link';
  readonly href: string;
  readonly label: string;
};

type SidebarItemCategory = {
  readonly type: 'category';
  readonly label: string;
  readonly items: SidebarItem[];
};

export type SidebarItem = SidebarItemLink | SidebarItemCategory;

const renderSidebarItems = (items: readonly SidebarItem[]) =>
  items.map((item, index) => <DocSidebarItem key={index} item={item} />);

const DocSidebarItem = ({ item }: { readonly item: SidebarItem }) =>
  item.type === 'category' ? (
    <DocSidebarItemCategory items={item.items} label={item.label} />
  ) : (
    <DocSidebarItemLink href={item.href} label={item.label} />
  );

const DocSidebarItemCategory = ({ items, label }: Omit<SidebarItemCategory, 'type'>) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <li className={clsx('menu__list-item', collapsed && 'menu__list-item--collapsed')}>
      <a
        className="menu__link menu__link--sublist"
        tabIndex={0}
        role="button"
        onClick={() => setCollapsed((state) => !state)}
      >
        {label}
      </a>
      <ul className="menu__list">{renderSidebarItems(items)}</ul>
    </li>
  );
};

const DocSidebarItemLink = ({ href, label }: Omit<SidebarItemLink, 'type'>) => (
  <li className="menu__list-item">
    <Link className="menu__link" to={href}>
      {label}
    </Link>
  </li>
);

const DocSidebar = ({ sidebar }: { readonly sidebar: readonly SidebarItem[] }): ReactElement => (
  <div className="doc-sidebar">
    <div className="menu menu--responsive thin-scrollbar">
      <ul className="menu__list">{renderSidebarItems(sidebar)}</ul>
    </div>
  </div>
);

export default DocSidebar;
