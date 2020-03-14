import React, { useState, ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import styles from './LanguageDemo.module.css';
import Editor from './Editor';

type Props = { readonly onSubmit: (code: string) => void };

const initialText = `/* Start to type your program */
// Add your comments!
// Press enter to add a new line.

class Main {
  function main(): string = "Hello World!"
}
`;

const rootClassName = [styles.ParallelCard, styles.EditorCard].join(' ');

/**
 * The component of the language demo.
 */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const [text, setText] = useState<string>(initialText);
  return (
    <Card className={rootClassName}>
      <CardContent className={styles.EditorCardContainer}>
        <Editor code={text} onCodeChange={setText} />
      </CardContent>
      <CardActions>
        <Button size="medium" color="primary" onClick={() => onSubmit(text)}>
          Submit Your Program
        </Button>
      </CardActions>
    </Card>
  );
}
