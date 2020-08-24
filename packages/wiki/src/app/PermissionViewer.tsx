import React, { ReactElement } from 'react';

import MarkdownBlock from './MarkdownBlock';
import { useWikiPrivateDocumentsMetadata } from './documents';

const PermissionViewer = (): ReactElement => {
  const documentMetadataList = useWikiPrivateDocumentsMetadata();

  if (documentMetadataList == null) {
    return <div className="simple-page-center">Loading...</div>;
  }

  const body = documentMetadataList
    .filter((it) => it.sharedWith.length > 0)
    .map(
      ({ filename, sharedWith }) =>
        `## \`${filename}\`\n\n${sharedWith.map((it) => `- ${it}\n`).join('')}\n`
    )
    .join('');

  return (
    <div className="container">
      <MarkdownBlock markdownCode={`# Permission Viewer\n\n${body}`} />
    </div>
  );
};

export default PermissionViewer;
