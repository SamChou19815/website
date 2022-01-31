// Credit: Adapted from https://github.com/satya164/react-simple-code-editor/blob/master/src/index.js

import createSamlangLanguageService from '@dev-sam/samlang-core/services';
import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';
import {
  DemoModuleReference,
  initializeMonacoEditor,
  MonacoEditor,
  monacoEditorOptions,
  samlangToMonacoRange,
} from './samlang-config';

type Props = { readonly code: string; readonly onCodeChange: (value: string) => void };

export default function PrismCodeEditor({ code, onCodeChange }: Props): JSX.Element {
  const serviceRef = useRef(createSamlangLanguageService([]));
  const monanoRef = useRef<MonacoEditor | null>(null);

  function onChange(newCode?: string) {
    if (newCode == null) return;
    onCodeChange(newCode);
    serviceRef.current.state.update(DemoModuleReference, newCode);
    const monaco = monanoRef.current;
    if (monaco == null) return;
    const model = monaco.editor.getModels()[0];
    if (model == null) return;
    monaco.editor.setModelMarkers(
      model,
      'samlang',
      serviceRef.current.state.getErrors(DemoModuleReference).map((it) => ({
        ...samlangToMonacoRange(it.range),
        message: it.toString(),
        severity: 8,
      }))
    );
  }

  return (
    <Editor
      defaultLanguage="samlang"
      theme="sam-theme"
      height="400px"
      value={code}
      options={monacoEditorOptions}
      onChange={onChange}
      beforeMount={(monaco) => {
        initializeMonacoEditor(monaco, serviceRef.current);
        monanoRef.current = monaco;
      }}
    />
  );
}
