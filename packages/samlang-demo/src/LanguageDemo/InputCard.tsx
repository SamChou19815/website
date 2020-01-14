import React, { useState, ReactElement, CSSProperties } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CodeBlock from 'lib-react/CodeBlock';
import styles from './LanguageDemo.module.css';

type Props = { readonly onSubmit: (code: string) => void };

const initialText = `/* Start to type your program */
// Add your comments!
// Press enter to add a new line.

class Main {
  function main(): string = "Hello World!"
}
`;

const rootClassName = [styles.ParallelCard, styles.EditorCard].join(' ');
const inputClassName = [styles.EditorCardLayer, styles.EditorCardInputLayer].join(' ');
const previewClassName = [styles.EditorCardLayer, styles.EditorCardPreviewLayer].join(' ');

/**
 * The component of the language demo.
 */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const [text, setText] = useState<string>(initialText);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const codeBlockStyle: CSSProperties = {
    transform: `translate(0, -${scrollTop}px)`,
    bottom: `-${scrollTop}px`
  };
  return (
    <Card className={rootClassName}>
      <CardContent className={styles.EditorCardContainer}>
        <textarea
          className={inputClassName}
          onChange={e => setText(e.currentTarget.value)}
          onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
          value={text}
        />
        <CodeBlock language="samlang" className={previewClassName} style={codeBlockStyle}>
          {text}
        </CodeBlock>
      </CardContent>
      <CardActions>
        <Button size="medium" color="primary" onClick={() => onSubmit(text)}>
          Submit Your Program
        </Button>
      </CardActions>
    </Card>
  );
}
