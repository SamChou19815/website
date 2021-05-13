import React, { ReactNode } from 'react';

import DocSidebar, { SidebarItem } from './DocSidebar';

type Props = {
  readonly sidebar: readonly SidebarItem[];
  readonly activePath: string;
  readonly children: ReactNode;
};

const DocLayout = ({ sidebar, activePath, children }: Props): JSX.Element => (
  <div className="lib-react-docs-layout">
    <div className="sidebar-container">
      <DocSidebar sidebar={sidebar} activePath={activePath} />
    </div>
    <main className="container document-container">{children}</main>
  </div>
);

export default DocLayout;
