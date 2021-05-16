import React, { useState } from 'react';

import MarkdownBlock from './MarkdownBlock';
import MarkdownInputCard from './MarkdownInputCard';
import { isAdminUser } from './authentication';

type Props = {
  readonly initialTitle: string;
  readonly initialMarkdownCode: string;
  readonly onSubmit: (title: string, code: string) => void;
};

const MarkdownEditorWithPreview = ({
  initialTitle,
  initialMarkdownCode,
  onSubmit,
}: Props): JSX.Element => {
  const [title, setTitle] = useState(initialTitle);
  const [code, setCode] = useState(initialMarkdownCode);

  return (
    <div className="markdown-editor-with-preview">
      <MarkdownInputCard
        title={title}
        code={code}
        className="parallel-card"
        showSaveButton={isAdminUser()}
        onTitleChange={setTitle}
        onCodeChange={setCode}
        onSubmit={onSubmit}
      />
      <div className="card parallel-card">
        <div className="card__header">
          <h2>Markdown Preview</h2>
        </div>
        <MarkdownBlock className="card__body" markdownCode={`# ${title}\n\n${code}`} />
      </div>
    </div>
  );
};

export default MarkdownEditorWithPreview;
