import parseMarkdownHeaderTree from 'esbuild-scripts/utils/markdown-header-parser';
import { getAppUser } from 'lib-firebase/authentication';
import TOC from 'lib-react-docs/components/TOC';
import React, { useState } from 'react';

import MarkdownBlock from './MarkdownBlock';
import PermissionViewer from './PermissionViewer';
import PrivateDocumentContentEditorModal from './PrivateDocumentContentEditorModal';
import PrivateDocumentMetadataEditor from './PrivateDocumentMetadataEditor';
import { isAdminUser } from './authentication';
import {
  WikiPrivateDocumentMetadata,
  deleteWikiPrivateDocument,
  useWikiPrivateDocumentContent,
  createWikiPrivateDocument,
} from './documents';

const PrivateDocumentPanelWithMetadata = ({
  metadata,
  showEditorModal,
  onEditorClose,
}: {
  readonly metadata: WikiPrivateDocumentMetadata;
  readonly showEditorModal: boolean;
  readonly onEditorClose: () => void;
}): JSX.Element => {
  const content = useWikiPrivateDocumentContent(metadata.documentID);
  if (content == null) return <>Loading...</>;

  const markdownCode = `# ${content.title}\n\n${content.markdownContent}`;
  return (
    <div className="row">
      <div className="col">
        <MarkdownBlock markdownCode={markdownCode} />
        {showEditorModal && (
          <PrivateDocumentContentEditorModal content={content} onClose={onEditorClose} />
        )}
      </div>
      <div className="col col--3">
        <TOC toc={parseMarkdownHeaderTree(markdownCode).children} hasLink={false} />
      </div>
    </div>
  );
};

const PrivateDocumentMetadataCard = ({
  metadata,
}: {
  readonly metadata: WikiPrivateDocumentMetadata;
}): JSX.Element => (
  <div className="card vertical-margin-1em">
    <div className="card__header">
      <h2>Document Metadata</h2>
    </div>
    <div className="card__body">
      Filename: <code>{metadata.filename}</code>
    </div>
    {metadata.sharedWith.length > 0 && (
      <div className="card__body">
        <div>Shared with:</div>
        <ul>
          {metadata.sharedWith.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

type Props = {
  readonly className?: string;
  readonly documentMetadata?: WikiPrivateDocumentMetadata;
};

const PrivateDocumentPanel = ({ documentMetadata }: Props): JSX.Element => {
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const isAdmin = isAdminUser();

  if (documentMetadata == null) {
    return (
      <>
        <h1>Hello {getAppUser().displayName}</h1>
        {isAdmin && (
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
        )}
        {isAdmin && (
          <div className="vertical-margin-1em">
            <PermissionViewer />
          </div>
        )}
        {!isAdmin && <div>Select a document on the left</div>}
      </>
    );
  }

  return (
    <>
      {isAdmin ? (
        <div className="button-group button-group--block vertical-margin-1em">
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
          <button className="button button--primary" onClick={() => setShowEditorModal(true)}>
            Edit document content
          </button>
          <button
            className="button button--primary"
            onClick={() => deleteWikiPrivateDocument(documentMetadata.documentID)}
          >
            Delete this document
          </button>
        </div>
      ) : (
        <div className="button-group button-group--block vertical-margin-1em">
          <button
            className="button button--primary"
            onClick={() => setShowMetadata((shown) => !shown)}
          >
            Toggle Metadata
          </button>
          <button className="button button--primary" onClick={() => setShowEditorModal(true)}>
            Show Markdown Source
          </button>
        </div>
      )}
      {isAdmin ? (
        <PrivateDocumentMetadataEditor metadata={documentMetadata} />
      ) : (
        showMetadata && <PrivateDocumentMetadataCard metadata={documentMetadata} />
      )}
      <PrivateDocumentPanelWithMetadata
        metadata={documentMetadata}
        showEditorModal={showEditorModal}
        onEditorClose={() => setShowEditorModal(false)}
      />
    </>
  );
};

export default PrivateDocumentPanel;
