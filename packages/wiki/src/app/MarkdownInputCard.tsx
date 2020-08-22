import React, { ReactElement } from 'react';

import usePrismTheme from '@theme/hooks/usePrismTheme';
import clsx from 'clsx';

import styles from './MarkdownInputCard.module.css';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

type Props = {
  readonly title: string;
  readonly code: string;
  readonly className?: string;
  readonly onTitleChange: (title: string) => void;
  readonly onCodeChange: (code: string) => void;
  readonly onSubmit: (title: string, code: string) => void;
};

const MarkdownInputCard = ({
  title,
  code,
  className,
  onTitleChange,
  onCodeChange,
  onSubmit,
}: Props): ReactElement => {
  const theme = usePrismTheme();

  return (
    <div className={clsx('card', className)}>
      <div className="card__header">
        <h2>Markdown Editor</h2>
      </div>
      <div className="card__body">
        <input
          className="text-input"
          type="text"
          value={title}
          placeholder="Title"
          onChange={(event) => onTitleChange(event.currentTarget.value)}
        />
      </div>
      <div
        className={clsx('card__body', styles.EditorCardContainer)}
        style={{ backgroundColor: 'var(--prism-code-block-background-color)' }}
      >
        <PrismCodeEditor
          language="markdown"
          code={code}
          theme={theme}
          onCodeChange={onCodeChange}
        />
      </div>
      <div className="card__footer">
        <button className="button button--primary" onClick={() => onSubmit(title, code)}>
          Save
        </button>
      </div>
    </div>
  );
};

export default MarkdownInputCard;
