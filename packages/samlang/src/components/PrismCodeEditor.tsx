// Credit: Adapted from https://github.com/satya164/react-simple-code-editor/blob/master/src/index.js

import { createSamlangLanguageService } from '@dev-sam/samlang-core';
import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';
import { initializeMonacoEditor, monacoEditorOptions } from './monaco-editor-config';

type Props = { readonly code: string; readonly onCodeChange: (value: string) => void };

export default function PrismCodeEditor({ code, onCodeChange }: Props): JSX.Element {
  const serviceRef = useRef(createSamlangLanguageService([]));

  return (
    <Editor
      defaultLanguage="samlang"
      theme="sam-theme"
      height="400px"
      value={code}
      options={monacoEditorOptions}
      onChange={(newCode) => newCode && onCodeChange(newCode)}
      beforeMount={(monaco) => initializeMonacoEditor(monaco, serviceRef.current)}
    />
  );
}
