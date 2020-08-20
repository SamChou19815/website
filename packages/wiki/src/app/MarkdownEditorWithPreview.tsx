import React, { useState, ReactElement } from 'react';

import usePrismTheme from '@theme/hooks/usePrismTheme';
import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import styles from './MarkdownEditorWithPreview.module.css';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

type MarkdownInputCardProps = {
  readonly code: string;
  readonly onCodeChange: (code: string) => void;
  readonly onSubmit: (code: string) => void;
};

const MarkdownInputCard = ({ code, onCodeChange, onSubmit }: MarkdownInputCardProps): ReactElement => {
  const theme = usePrismTheme();

  return (
    <div className={clsx('card', styles.ParallelCard)}>
      <div className="card__header">
        <h2>Markdown Editor</h2>
      </div>
      <div
        className={clsx('card__body', styles.EditorCardContainer)}
        style={{ backgroundColor: theme.plain.backgroundColor }}
      >
        <PrismCodeEditor
          language="markdown"
          code={code}
          theme={theme}
          onCodeChange={onCodeChange}
        />
      </div>
      <div className="card__footer">
        <button className="button button--primary" onClick={() => onSubmit(code)}>Save</button>
      </div>
    </div>
  )
};

const MarkdownPreviewCard = ({ markdownCode }: { readonly markdownCode: string }): ReactElement => {
  return (
    <div className={clsx('card', styles.ParallelCard)}>
      <div className="card__header">
        <h2>Markdown Preview</h2>
      </div>
      <MarkdownBlock className="card__body" markdownCode={markdownCode} />
    </div>
  );
}

type Props = { readonly initialMarkdownCode: string; readonly onSubmit: (code: string) => void };

const MarkdownEditorWithPreview = ({ initialMarkdownCode, onSubmit }: Props): ReactElement => {
  const [code, setCode] = useState(initialMarkdownCode);

  return (
    <div className={styles.MarkdownEditorWithPreview}>
      <MarkdownInputCard code={code} onCodeChange={setCode} onSubmit={onSubmit} />
      <MarkdownPreviewCard markdownCode={code} />
    </div>
  )
}

export default MarkdownEditorWithPreview;
