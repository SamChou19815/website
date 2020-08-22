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
  updateWikiPrivateDocumentContent,
} from './documents';

const Editor = ({ content }: { readonly content: WikiPrivateDocumentContent }): ReactElement => {
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

const editTitle = (content: WikiPrivateDocumentContent): void => {
  updateWikiPrivateDocumentContent({
    ...content,
    // eslint-disable-next-line no-alert
    title: prompt('New Title', content.title) ?? content.title,
  });
};

type PropsWithMetadata = {
  readonly className?: string;
  readonly metadata: WikiPrivateDocumentMetadata;
};

const PrivateDocumentPanelWithMetadata = ({
  className,
  metadata: { documentID },
}: PropsWithMetadata): ReactElement => {
  const content = useWikiPrivateDocumentContent(documentID);
  if (content == null) return <main className={clsx('container', className)}>Loading...</main>;

  return (
    <main className={clsx('container', className)}>
      {isAdminUser() && (
        <div className={`button-group button-group--block ${styles.ControlButtonGroup}`}>
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
          <button className="button button--primary" onClick={() => editTitle(content)}>
            Edit Title
          </button>
          <button
            className="button button--primary"
            onClick={() => deleteWikiPrivateDocument(documentID)}
          >
            Delete this document
          </button>
        </div>
      )}
      <MarkdownBlock markdownCode={`# ${content.title}\n\n${content.markdownContent}`} />
      {isAdminUser() && <Editor key={documentID} content={content} />}
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
        {isAdminUser() ? (
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
