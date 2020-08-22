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

type MetadataEditorProps = {
  readonly document: WikiPrivateDocumentMetadata & WikiPrivateDocumentContent;
};

const MetadataEditor = ({ document }: MetadataEditorProps): ReactElement => {
  const [filename, setFilename] = useState(document.filename);
  const [sharedWithString, setSharedWithString] = useState(document.sharedWith.join(','));
  const [title, setTitle] = useState(document.title);

  return (
    <div className={clsx('card', styles.ControlGroup)}>
      <div className="card__header">
        <h2>Edit Document Metadata</h2>
      </div>
      <div className="card__body">
        <input
          className={styles.Input}
          type="text"
          value={filename}
          placeholder="Filename"
          onChange={(event) => setFilename(event.currentTarget.value)}
        />
      </div>
      <div className="card__body">
        <input
          className={styles.Input}
          type="text"
          value={title}
          placeholder="Title"
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
      </div>
      <div className="card__body">
        <input
          className={styles.Input}
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
            const sharedWith =
              sharedWithString.trim() === ''
                ? []
                : sharedWithString.split(',').map((it) => it.trim());
            updateWikiPrivateDocumentMetadata({
              documentID: document.documentID,
              filename,
              sharedWith,
            });
            updateWikiPrivateDocumentContent({
              documentID: document.documentID,
              title,
              markdownContent: document.markdownContent,
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
  const [code, setCode] = useState(content.markdownContent);

  return (
    <MarkdownInputCard
      code={code}
      onCodeChange={setCode}
      onSubmit={(markdownContent) =>
        updateWikiPrivateDocumentContent({ ...content, markdownContent })
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
  const { documentID, filename, sharedWith } = metadata;
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
      {isAdminUser() && <MetadataEditor document={{ filename, sharedWith, ...content }} />}
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
