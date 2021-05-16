import clsx from 'clsx';
import React from 'react';

import PrismCodeEditor from 'lib-react-prism/PrismCodeEditor';
import theme from 'lib-react-prism/prism-theme.json';

type Props = {
  readonly title: string;
  readonly code: string;
  readonly className?: string;
  readonly showSaveButton: boolean;
  readonly onTitleChange: (title: string) => void;
  readonly onCodeChange: (code: string) => void;
  readonly onSubmit: (title: string, code: string) => void;
};

const MarkdownInputCard = ({
  title,
  code,
  className,
  showSaveButton,
  onTitleChange,
  onCodeChange,
  onSubmit,
}: Props): JSX.Element => {
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
        className="card__body markdown-input-card-container"
        style={{ backgroundColor: 'var(--prism-code-block-background-color)' }}
      >
        <PrismCodeEditor
          language="markdown"
          code={code}
          theme={theme}
          onCodeChange={onCodeChange}
        />
      </div>
      {showSaveButton && (
        <div className="card__footer">
          <button className="button button--primary" onClick={() => onSubmit(title, code)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkdownInputCard;
