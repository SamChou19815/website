import React, { ReactElement, useState } from 'react';

import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import PrivateDocumentContentEditorModal from './PrivateDocumentContentEditorModal';
import PrivateDocumentMetadataEditor from './PrivateDocumentMetadataEditor';
import { isAdminUser, getAppUser } from './authentication';
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
}): ReactElement => {
  const content = useWikiPrivateDocumentContent(metadata.documentID);
  if (content == null) return <>Loading...</>;

  return (
    <>
      <MarkdownBlock markdownCode={`# ${content.title}\n\n${content.markdownContent}`} />
      {showEditorModal && (
        <PrivateDocumentContentEditorModal content={content} onClose={onEditorClose} />
      )}
    </>
  );
};

const PrivateDocumentMetadataCard = ({
  metadata,
}: {
  readonly metadata: WikiPrivateDocumentMetadata;
}): ReactElement => (
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

const PrivateDocumentPanel = ({ className, documentMetadata }: Props): ReactElement => {
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const isAdmin = isAdminUser();

  if (documentMetadata == null) {
    return (
      <main className={clsx('container', className)}>
        <h1>Hello {getAppUser().displayName}</h1>
        {!isAdmin ? (
          <div>Select a document on the left</div>
        ) : (
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
        )}
      </main>
    );
  }

  return (
    <main className={clsx('container', className)}>
      {!isAdmin ? (
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
        <button
          className="button button--block button--primary vertical-margin-1em"
          onClick={() => setShowMetadata((shown) => !shown)}
        >
          Toggle Metadata
        </button>
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
    </main>
  );
};

export default PrivateDocumentPanel;
