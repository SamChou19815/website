import React, { useState, ReactElement } from 'react';

import usePrismTheme from '@theme/hooks/usePrismTheme';
import clsx from 'clsx';

import MarkdownBlock from './MarkdownBlock';
import styles from './MarkdownEditorWithPreview.module.css';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

type MarkdownInputCardProps = {
  readonly code: string,
  readonly onCodeChange: (code: string) => void
};

const MarkdownInputCard = ({ code, onCodeChange }: MarkdownInputCardProps): ReactElement => {
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

const MarkdownEditorWithPreview = (): ReactElement => {
  const [code, setCode] = useState('');

  return (
    <div className={styles.MarkdownEditorWithPreview}>
      <MarkdownInputCard code={code} onCodeChange={setCode} />
      <MarkdownPreviewCard markdownCode={code} />
    </div>
  )
}

export default MarkdownEditorWithPreview;
