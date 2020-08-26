import React, { useState, ReactElement } from 'react';

import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import styles from './MarkdownEditorWithPreview.module.css';
import MarkdownInputCard from './MarkdownInputCard';
import { isAdminUser } from './authentication';

const MarkdownPreviewCard = ({ markdownCode }: { readonly markdownCode: string }): ReactElement => {
  return (
    <div className={clsx('card', styles.ParallelCard)}>
      <div className="card__header">
        <h2>Markdown Preview</h2>
      </div>
      <MarkdownBlock className="card__body" markdownCode={markdownCode} />
    </div>
  );
};

type Props = {
  readonly initialTitle: string;
  readonly initialMarkdownCode: string;
  readonly onSubmit: (title: string, code: string) => void;
};

const MarkdownEditorWithPreview = ({
  initialTitle,
  initialMarkdownCode,
  onSubmit,
}: Props): ReactElement => {
  const [title, setTitle] = useState(initialTitle);
  const [code, setCode] = useState(initialMarkdownCode);

  return (
    <div className={styles.MarkdownEditorWithPreview}>
      <MarkdownInputCard
        title={title}
        code={code}
        className={styles.ParallelCard}
        showSaveButton={!isAdminUser()}
        onTitleChange={setTitle}
        onCodeChange={setCode}
        onSubmit={onSubmit}
      />
      <MarkdownPreviewCard markdownCode={`# ${title}\n\n${code}`} />
    </div>
  );
};

export default MarkdownEditorWithPreview;
