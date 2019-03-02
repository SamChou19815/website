// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import highlight from 'highlight.js';
import './CodeBlock.css';

type Props = {|
  +children: string;
  +className?: string;
  +style?: { +[string]: string }
|};

export default function CodeBlock({ children, className, style }: Props): Node {
  const codeBlockRef = React.useRef(null);
  React.useEffect(() => {
    try {
      highlight.highlightBlock(codeBlockRef.current);
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
