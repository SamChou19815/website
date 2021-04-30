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

const isActiveSidebarItem = (item: SidebarItem, activePath: string): boolean => {
  if (item.type === 'link') return item.href === activePath;
  if (item.type === 'category') {
    return item.items.some((subItem) => isActiveSidebarItem(subItem, activePath));
  }
  return false;
};

const renderSidebarItems = (items: readonly SidebarItem[], activePath: string) =>
  items.map((item, index) => <DocSidebarItem key={index} item={item} activePath={activePath} />);

type ItemWithactivePath<T> = { readonly item: T; readonly activePath: string };

const DocSidebarItem = ({ item, activePath }: ItemWithactivePath<SidebarItem>) =>
  item.type === 'category' ? (
    <DocSidebarItemCategory item={item} activePath={activePath} />
  ) : (
    <DocSidebarItemLink item={item} activePath={activePath} />
  );

const DocSidebarItemCategory = ({ item, activePath }: ItemWithactivePath<SidebarItemCategory>) => {
  const { items, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <li className={clsx('menu__list-item', collapsed && 'menu__list-item--collapsed')}>
      <a
        className={clsx('menu__link menu__link--sublist', isActive && 'menu__link--active')}
        tabIndex={0}
        role="button"
        onClick={() => setCollapsed((state) => !state)}
      >
        {label}
      </a>
      <ul className="menu__list">{renderSidebarItems(items, activePath)}</ul>
    </li>
  );
};

const DocSidebarItemLink = ({ item, activePath }: ItemWithactivePath<SidebarItemLink>) => {
  const { href, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);

  return (
    <li className="menu__list-item">
      <Link className={clsx('menu__link', isActive && 'menu__link--active')} to={href}>
        {label}
      </Link>
    </li>
  );
};

type Props = { readonly sidebar: readonly SidebarItem[]; readonly activePath: string };

const DocSidebar = ({ sidebar, activePath }: Props): ReactElement => (
  <div className="doc-sidebar">
    <div className="menu menu--responsive thin-scrollbar">
      <ul className="menu__list">{renderSidebarItems(sidebar, activePath)}</ul>
    </div>
  </div>
);

export default DocSidebar;
