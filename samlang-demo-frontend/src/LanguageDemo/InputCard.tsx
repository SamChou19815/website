import React, { ReactElement, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './LanguageDemo.module.css';
import { theme, languageConfiguration, languageDefinition, editorOptions } from './editor';

type Props = { readonly onSubmit: (code: string) => void };

const initialText = `/* Start to type your program */
// Add your comments */
// Press enter to add a new line.

class Main {
  function main(): string = "Hello World!"
}
`;

const editorWillMount = (monaco: typeof monacoEditor): void => {
  const { editor, languages } = monaco;
  editor.defineTheme('sam-theme', theme);
  languages.register({ id: 'samlang' });
  languages.setLanguageConfiguration('samlang', languageConfiguration);
  languages.setMonarchTokensProvider('samlang', languageDefinition);
};

const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor): void => {
  editor.focus();
};

const useEditorHeight = (): number => {
  const [height, setHeight] = useState(window.innerHeight - 200);
  const listener = (): void => setHeight(window.innerHeight - 200);
  useEffect((): (() => void) => {
    listener();
    window.addEventListener('resize', listener);
    return (): void => window.removeEventListener('resize', listener);
  }, []);
  return height;
};

const className = [styles.ParallelCard, styles.EditorCard].join(' ');

/**
 * The component of the language demo.
 */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const [text, setText] = React.useState<string>(initialText);
  const editorHeight = useEditorHeight();
  const onEditorChange = (newValue: string): void => setText(newValue);
  const onSubmitClicked = (): void => onSubmit(text);
  return (
    <Card className={className}>
      <CardContent>
        <MonacoEditor
          height={editorHeight}
          language="samlang"
          theme="sam-theme"
          value={text}
          options={editorOptions}
          onChange={onEditorChange}
          editorWillMount={editorWillMount}
          editorDidMount={editorDidMount}
        />
      </CardContent>
      <CardActions className={styles.GameCardControls}>
        <Button size="medium" color="primary" onClick={onSubmitClicked}>
          Submit Your Program
        </Button>
      </CardActions>
    </Card>
  );
}
