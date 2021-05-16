import React, { useState, useEffect } from 'react';

import PrivateDocumentPanel from './PrivateDocumentPanel';
import { useWikiPrivateDocumentsMetadata } from './documents';
import treeifyDocumentMetadata from './generate-sidebar';

import DocLayout from 'lib-react-docs/components/DocLayout';
import LoadingOverlay from 'lib-react-loading';

const App = (): JSX.Element => {
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
    <DocLayout
      sidebar={treeifyDocumentMetadata(documentMetadataList)}
      activePath={`/intern${documentID == null ? '' : `#doc-${documentID}`}`}
    >
      <PrivateDocumentPanel
        key={documentMetadata?.documentID ?? ''}
        documentMetadata={documentMetadata}
      />
    </DocLayout>
  );
};

export default App;
