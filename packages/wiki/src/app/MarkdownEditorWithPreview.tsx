import React, { useState, ReactElement } from 'react';

import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import styles from './MarkdownEditorWithPreview.module.css';
import MarkdownInputCard from './MarkdownInputCard';

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

type Props = { readonly initialMarkdownCode: string; readonly onSubmit: (code: string) => void };

const MarkdownEditorWithPreview = ({ initialMarkdownCode, onSubmit }: Props): ReactElement => {
  const [code, setCode] = useState(initialMarkdownCode);

  return (
    <div className={styles.MarkdownEditorWithPreview}>
      <MarkdownInputCard
        code={code}
        className={styles.ParallelCard}
        onCodeChange={setCode}
        onSubmit={onSubmit}
      />
      <MarkdownPreviewCard markdownCode={code} />
    </div>
  );
};

export default MarkdownEditorWithPreview;
