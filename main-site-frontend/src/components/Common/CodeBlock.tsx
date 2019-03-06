import React, { ReactElement } from 'react';
import highlight from 'highlight.js';
import './CodeBlock.css';

type Props = {
  readonly children: string;
  readonly className?: string;
  readonly style?: { [cssProp: string]: string }
};

export default function CodeBlock({ children, className, style }: Props): ReactElement {
  const codeBlockRef = React.useRef(null);
  React.useEffect(() => {
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
      <code className="samlang" ref={codeBlockRef}>
        {children}
      </code>
    </pre>
  );
}
