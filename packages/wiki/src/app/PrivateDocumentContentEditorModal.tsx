import React from 'react';

import MarkdownEditorWithPreview from './MarkdownEditorWithPreview';
import { WikiPrivateDocumentContent, updateWikiPrivateDocumentContent } from './documents';

type Props = {
  readonly content: WikiPrivateDocumentContent;
  readonly onClose: () => void;
};

const PrivateDocumentContentEditorModal = ({ content, onClose }: Props): JSX.Element => {
  return (
    <div className="private-document-content-editor-modal">
      <div className="float-right-button-container">
        <button className="button button--primary" onClick={onClose}>
          Close
        </button>
      </div>
      <MarkdownEditorWithPreview
        initialTitle={content.title}
        initialMarkdownCode={content.markdownContent}
        onSubmit={(title, markdownContent) => {
          updateWikiPrivateDocumentContent({
            documentID: content.documentID,
            title,
            markdownContent,
          });
          onClose();
        }}
      />
    </div>
  );
};

export default PrivateDocumentContentEditorModal;
