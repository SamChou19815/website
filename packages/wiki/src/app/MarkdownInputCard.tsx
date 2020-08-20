import React, { ReactElement } from 'react';

import usePrismTheme from '@theme/hooks/usePrismTheme';
import clsx from 'clsx';

import styles from './MarkdownInputCard.module.css';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

type Props = {
  readonly code: string;
  readonly className?: string;
  readonly onCodeChange: (code: string) => void;
  readonly onSubmit: (code: string) => void;
};

const MarkdownInputCard = ({ code, className, onCodeChange, onSubmit }: Props): ReactElement => {
  const theme = usePrismTheme();

  return (
    <div className={clsx('card', className)}>
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
        <button className="button button--primary" onClick={() => onSubmit(code)}>
          Save
        </button>
      </div>
    </div>
  );
};

export default MarkdownInputCard;
