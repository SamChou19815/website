import React, { ReactElement } from 'react';

import MarkdownEditorWithPreview from './MarkdownEditorWithPreview';
import styles from './PrivateDocumentContentEditorModal.module.css';
import { WikiPrivateDocumentContent, updateWikiPrivateDocumentContent } from './documents';

type Props = {
  readonly content: WikiPrivateDocumentContent;
  readonly onClose: () => void;
};

const PrivateDocumentContentEditorModal = ({ content, onClose }: Props): ReactElement => {
  return (
    <div className={styles.PrivateDocumentContentEditorModal}>
      <div className={styles.FloatRightButtonContainer}>
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
