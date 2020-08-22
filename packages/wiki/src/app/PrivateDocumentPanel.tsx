import React, { ReactElement, useState } from 'react';

import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import MarkdownInputCard from './MarkdownInputCard';
import styles from './PrivateDocumentPanel.module.css';
import { isAdminUser, getAppUser } from './authentication';
import {
  WikiPrivateDocumentMetadata,
  WikiPrivateDocumentContent,
  deleteWikiPrivateDocument,
  useWikiPrivateDocumentContent,
  createWikiPrivateDocument,
  updateWikiPrivateDocumentMetadata,
  updateWikiPrivateDocumentContent,
} from './documents';

const MetadataEditor = ({
  metadata,
}: {
  readonly metadata: WikiPrivateDocumentMetadata;
}): ReactElement => {
  const [filename, setFilename] = useState(metadata.filename);
  const [sharedWithString, setSharedWithString] = useState(metadata.sharedWith.join(','));

  return (
    <div className={clsx('card', styles.ControlGroup)}>
      <div className="card__header">
        <h2>Edit Document Metadata</h2>
      </div>
      <div className="card__body">
        <input
          className="text-input"
          type="text"
          value={filename}
          placeholder="Filename"
          onChange={(event) => setFilename(event.currentTarget.value)}
        />
      </div>
      <div className="card__body">
        <input
          className="text-input"
          type="text"
          value={sharedWithString}
          placeholder="Shared With"
          onChange={(event) => setSharedWithString(event.currentTarget.value)}
        />
      </div>
      <div className="card__footer">
        <button
          className="button button--primary"
          onClick={() => {
            updateWikiPrivateDocumentMetadata({
              documentID: metadata.documentID,
              filename,
              sharedWith:
                sharedWithString.trim() === ''
                  ? []
                  : sharedWithString.split(',').map((it) => it.trim()),
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ContentEditor = ({
  content,
}: {
  readonly content: WikiPrivateDocumentContent;
}): ReactElement => {
  const [title, setTitle] = useState(content.title);
  const [code, setCode] = useState(content.markdownContent);

  return (
    <MarkdownInputCard
      title={title}
      code={code}
      onTitleChange={setTitle}
      onCodeChange={setCode}
      onSubmit={(markdownContent) =>
        updateWikiPrivateDocumentContent({ documentID: content.documentID, title, markdownContent })
      }
    />
  );
};

type PropsWithMetadata = {
  readonly className?: string;
  readonly metadata: WikiPrivateDocumentMetadata;
};

const PrivateDocumentPanelWithMetadata = ({
  className,
  metadata,
}: PropsWithMetadata): ReactElement => {
  const { documentID } = metadata;
  const content = useWikiPrivateDocumentContent(documentID);
  if (content == null) return <main className={clsx('container', className)}>Loading...</main>;

  return (
    <main className={clsx('container', className)}>
      {isAdminUser() && (
        <div className={`button-group button-group--block ${styles.ControlGroup}`}>
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
          <button
            className="button button--primary"
            onClick={() => deleteWikiPrivateDocument(documentID)}
          >
            Delete this document
          </button>
        </div>
      )}
      {isAdminUser() && <MetadataEditor metadata={metadata} />}
      <MarkdownBlock markdownCode={`# ${content.title}\n\n${content.markdownContent}`} />
      {isAdminUser() && <ContentEditor content={content} />}
    </main>
  );
};

type Props = {
  readonly className?: string;
  readonly documentMetadata?: WikiPrivateDocumentMetadata;
};

const PrivateDocumentPanel = ({ className, documentMetadata }: Props): ReactElement => {
  if (documentMetadata == null) {
    return (
      <main className={clsx('container', className)}>
        <h1>Hello {getAppUser().displayName}</h1>
        {!isAdminUser() ? (
          <div>Select a document on the left</div>
        ) : (
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
        )}
      </main>
    );
  }

  return <PrivateDocumentPanelWithMetadata className={className} metadata={documentMetadata} />;
};

export default PrivateDocumentPanel;
