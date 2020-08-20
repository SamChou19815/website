import React, { ReactElement, useState, useEffect } from 'react';

import DocSidebar from '@theme/DocSidebar';

import styles from './App.module.css';
import { getAppUser } from './authentication';

const sidebar = [
  {
    label: 'Documents Shared with You',
    type: 'category',
    collapsed: false,
    items: [
      { type: 'link', label: 'Foo', href: '/intern#doc-foo' },
      { type: 'link', label: 'Bar', href: '/intern#doc-bar' },
    ],
  }
];

const App = (): ReactElement => {
  const [documentID, setDocumentID] = useState<string | null>(null);

  useEffect(() => {
    const handle = setInterval(() => {
      setDocumentID(location.hash.length === 0 ? null : location.hash.substring(1));
    }, 50);
    () => clearInterval(handle);
  });

  return (
    <div className={styles.App}>
      <div className={styles.DocumentSidebarContainer} role="complementary">
        <DocSidebar
          sidebar={sidebar}
          path={`/intern${documentID == null ? '' : `#${documentID}`}`}
          sidebarCollapsible />
      </div>
      <main className={styles.DocumentMainContainer}>
        <div>Hello {getAppUser().displayName}!</div>
        {documentID && <div>Document ID is {documentID}</div>}
      </main>
    </div>
  );
}

export default App;
