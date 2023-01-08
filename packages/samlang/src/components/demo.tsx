import theme from 'lib-react-prism/prism-theme.json';
import Editor from '@monaco-editor/react';
import React, { useState, useRef, useEffect } from 'react';
import * as samlang from 'samlang-demo';
import { initializeMonacoEditor, MonacoEditor, monacoEditorOptions } from './samlang-config';

const INITIAL_CODE = `class Main {
  function main(): unit =
    Builtins.println("Hello World!")
}
`;

const HEIGHT = 'calc(100vh - 2.5rem)';

async function getResponse(programString: string): Promise<samlang.CompilationResult> {
  try {
    return samlang.compile(programString);
  } catch (interpreterError) {
    console.error(interpreterError);
    return `Interpreter Error:
${interpreterError instanceof Error ? interpreterError.message : 'Unknown Error'}`;
  }
}

function ReadOnlyResultEditor({
  response,
}: { readonly response: samlang.CompilationResult | null }): JSX.Element {
  if (typeof response === 'string' || response == null) {
    return (
      <Editor
        width="50vw"
        height={HEIGHT}
        theme="sam-theme"
        path='result.txt'
        value={response ?? 'Loading response...'}
        options={{ ...monacoEditorOptions, readOnly: true }}
      />
    );
  } else {
    const text = `// Standard out:
// ${response.interpreterResult}
// Optimized TypeScript emit:
${response.tsCode}`;
    return (
      <Editor
        defaultLanguage="typescript"
        theme="sam-theme"
        width="50vw"
        height={HEIGHT}
        path='Demo.ts'
        value={text}
        options={{ ...monacoEditorOptions, readOnly: true }}
      />
    );
  }
}

export default function LanguageDemo() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [response, setResponse] = useState<samlang.CompilationResult | null>(null);
  const serviceRef = useRef({ source: '' });
  const monanoRef = useRef<MonacoEditor | null>(null);

  useEffect(() => {
    getResponse(INITIAL_CODE).then(setResponse);
  }, []);

  useEffect(() => {
    const monaco = monanoRef.current;
    if (monaco == null) {
      return;
    }
    const model = monaco.editor.getModels()[0];
    if (model == null) {
      return;
    }
    if (typeof response !== 'string') {
      monaco.editor.setModelMarkers(model, 'samlang', []);
      return;
    }
    monaco.editor.setModelMarkers(
      model,
      'samlang',
      response.split('\n').flatMap((line) => {
        const [p1, p2] = line.substring('Demo.sam:'.length).split('-');
        if (p1 == null || p2 == null) return [];
        const [lineStart, colStart] = p1.split(':');
        const [lineEnd, colEnd, ...rest] = p2.split(':');
        if (lineStart == null || colStart == null || lineEnd == null || colEnd == null) {
          return [];
        }
        return {
          startLineNumber: parseInt(lineStart, 10),
          startColumn: parseInt(colStart, 10),
          endLineNumber: parseInt(lineEnd, 10),
          endColumn: parseInt(colEnd, 10),
          message: rest.join(':').trim(),
          severity: 8,
        };
      }),
    );
  }, [response]);

  return (
    <div>
      <div className="flex w-full">
        <div className="w-3/6 h-10 leading-10 text-center border-r-2 border-r-gray-300">
          Demo.sam
        </div>
        <div className="w-3/6 h-10 leading-10 text-center">
          Compiler Output & Interpreter Result
        </div>
      </div>
      <div
        style={{ backgroundColor: (theme.plain as Record<string, string>).backgroundColor }}
        className="flex"
      >
        {__SERVER__ ? null : (
          <>
            <Editor
              defaultLanguage="samlang"
              className="border-r-2 border-r-gray-300"
              theme="sam-theme"
              width="50vw"
              height={HEIGHT}
              defaultValue={code}
              options={monacoEditorOptions}
              onChange={(newCode?: string) => {
                if (newCode != null) {
                  serviceRef.current.source = code;
                  setCode(newCode);
                  getResponse(newCode).then(setResponse);
                }
              }}
              beforeMount={(monaco) => {
                initializeMonacoEditor(monaco, serviceRef.current);
                monanoRef.current = monaco;
              }}
            />
            <ReadOnlyResultEditor response={response} />
          </>
        )}
      </div>
    </div>
  );
}
