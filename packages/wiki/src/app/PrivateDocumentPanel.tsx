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
        <div className="button-group button-group--block vertical-margin-1em">
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
      {isAdminUser() && <PrivateDocumentMetadataEditor metadata={metadata} />}
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
