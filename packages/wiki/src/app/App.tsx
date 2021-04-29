import React, { ReactElement, useState, useEffect } from 'react';

import PrivateDocumentPanel from './PrivateDocumentPanel';
import Sidebar from './Sidebar';
import { useWikiPrivateDocumentsMetadata } from './documents';

import LoadingOverlay from 'lib-react/LoadingOverlay';

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
    return <LoadingOverlay />;
  }

  const documentMetadata = documentMetadataList.find(
    (metadata) => metadata.documentID === documentID
  );

  return (
    <div className="top-level">
      <Sidebar
        className="sidebar-container"
        selectedDocumentID={documentID}
        documentMetadataList={documentMetadataList}
      />
      <PrivateDocumentPanel
        key={documentMetadata?.documentID ?? ''}
        className="document-container"
        documentMetadata={documentMetadata}
      />
    </div>
  );
};

export default App;
