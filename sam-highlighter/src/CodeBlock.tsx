import React, { CSSProperties, ReactElement } from 'react';
import highlight from 'highlight.js';
import './CodeBlock.css';

type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export default ({ language, children, className, style }: Props): ReactElement => {
  const codeBlockRef = React.useRef(null);
  React.useEffect((): void => {
    const node = codeBlockRef.current;
    if (node == null) {
      return;
    }
    try {
      highlight.highlightBlock(node);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Safari does not support lookbehind regex. Skip rerender!');
    }
  });
  return (
    <pre className={className} style={style}>
      <code className={language} ref={codeBlockRef}>
        {children}
      </code>
    </pre>
  );
}
