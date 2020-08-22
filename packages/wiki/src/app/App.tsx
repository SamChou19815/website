import React, { ReactElement, useState, useEffect } from 'react';

import styles from './App.module.css';
import PrivateDocumentPanel from './PrivateDocumentPanel';
import Sidebar from './Sidebar';
import { useWikiPrivateDocumentsMetadata } from './documents';

const App = (): ReactElement => {
  const [documentID, setDocumentID] = useState<string | null>(null);

  useEffect(() => {
    const handle = setInterval(() => {
      setDocumentID(location.hash.startsWith('#doc-') ? location.hash.substring(5) : null);
    }, 50);
    () => clearInterval(handle);
  });

  const documentMetadataList = useWikiPrivateDocumentsMetadata();

  if (documentMetadataList == null) {
    return <div className="simple-page-center">Loading...</div>;
  }

  return (
    <div className={styles.App}>
      <Sidebar
        className={styles.DocumentSidebarContainer}
        selectedDocumentID={documentID}
        documentMetadataList={documentMetadataList}
      />
      <PrivateDocumentPanel
        className={styles.DocumentMainContainer}
        documentMetadata={documentMetadataList.find(
          (metadata) => metadata.documentID === documentID
        )}
      />
    </div>
  );
};

export default App;
