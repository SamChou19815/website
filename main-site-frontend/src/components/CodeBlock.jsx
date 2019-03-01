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
  React.useEffect(() => highlight.highlightBlock(codeBlockRef.current));
  return (
    <pre className={className} style={style}>
      <code className="samlang" ref={codeBlockRef}>
        {children}
      </code>
    </pre>
  );
}
