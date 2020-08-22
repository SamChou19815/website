import React, { ReactElement, useState } from 'react';

import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import MarkdownInputCard from './MarkdownInputCard';
import PrivateDocumentMetadataEditor from './PrivateDocumentMetadataEditor';
import { isAdminUser, getAppUser } from './authentication';
import {
  WikiPrivateDocumentMetadata,
  WikiPrivateDocumentContent,
  deleteWikiPrivateDocument,
  useWikiPrivateDocumentContent,
  createWikiPrivateDocument,
  updateWikiPrivateDocumentContent,
} from './documents';

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

const PrivateDocumentPanelWithMetadata = ({
  metadata,
}: {
  readonly metadata: WikiPrivateDocumentMetadata;
}): ReactElement => {
  const content = useWikiPrivateDocumentContent(metadata.documentID);
  if (content == null) return <>Loading...</>;

  return (
    <>
      <MarkdownBlock markdownCode={`# ${content.title}\n\n${content.markdownContent}`} />
      {isAdminUser() && <ContentEditor content={content} />}
    </>
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

  return (
    <main className={clsx('container', className)}>
      {isAdminUser() && (
        <div className="button-group button-group--block vertical-margin-1em">
          <button className="button button--primary" onClick={createWikiPrivateDocument}>
            Create new document
          </button>
          <button
            className="button button--primary"
            onClick={() => deleteWikiPrivateDocument(documentMetadata.documentID)}
          >
            Delete this document
          </button>
        </div>
      )}
      {isAdminUser() && <PrivateDocumentMetadataEditor metadata={documentMetadata} />}
      <PrivateDocumentPanelWithMetadata className={className} metadata={documentMetadata} />
    </main>
  );
};

export default PrivateDocumentPanel;
