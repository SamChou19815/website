import React, { ReactElement, useState, useEffect } from 'react';

import DocSidebar from '@theme/DocSidebar';

import styles from './App.module.css';
import MarkdownBlock from './MarkdownBlock';
import { getAppUser } from './authentication';
import { WikiPrivateDocument } from './documents';

const documents: readonly WikiPrivateDocument[] = [
  { documentID: 'foo', sharedWith: [], title: 'Foo', markdownContent: '# h2\n- a\n- b\n' },
  { documentID: 'bar', sharedWith: [], title: 'Bar', markdownContent: '# h2\n### h3\n[sam](https://developersam.com)\n' }
]

const App = (): ReactElement => {
  const [documentID, setDocumentID] = useState<string | null>(null);

  useEffect(() => {
    const handle = setInterval(() => {
      setDocumentID(location.hash.startsWith('#doc-') ? location.hash.substring(5) : null);
    }, 50);
    () => clearInterval(handle);
  });

  const documentToRender = documents.find(document => document.documentID === documentID);
  const markdownCode = documentToRender != null
    ? `# ${documentToRender.title}\n\n${documentToRender.markdownContent}`
    : '# Select a document on the left';

  return (
    <div className={styles.App}>
      <div className={styles.DocumentSidebarContainer} role="complementary">
        <DocSidebar
          sidebar={[
            {
              label: 'Documents Shared with You',
              type: 'category',
              collapsed: false,
              items: documents.map(({ documentID: id, title }) => ({
                type: 'link', label: title, href: `/intern#doc-${id}`
              }))
            }
          ]}
          path={`/intern${documentID == null ? '' : `#doc-${documentID}`}`}
          sidebarCollapsible
        />
      </div>
      <main className={styles.DocumentMainContainer}>
        <div>Hello {getAppUser().displayName}!</div>
        <MarkdownBlock markdownCode={markdownCode} />
      </main>
    </div>
  );
}

export default App;
