import {
  compileSingleSamlangSource,
  SamlangSingleSourceCompilationResult,
} from '@dev-sam/samlang-core';
import theme from 'lib-react-prism/prism-theme.json';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React, { useState } from 'react';
import PrismCodeEditor from './PrismCodeEditor';

const initialText = `class Main {
  function main(): unit =
    Builtins.println("Hello World!")
}`;

function getResponse(programString: string): SamlangSingleSourceCompilationResult {
  try {
    return compileSingleSamlangSource(programString);
  } catch (interpreterError) {
    return {
      __type__: 'ERROR',
      errors: [
        (interpreterError instanceof Error && interpreterError.message) ||
          'Unknown interpreter error.',
      ],
    };
  }
}

type DemoResultProps = {
  readonly title: string;
  readonly language?: string;
  readonly borderColorCSS: string;
  readonly children: string;
};
function DemoResult({ title, language = '', borderColorCSS, children }: DemoResultProps) {
  return (
    <div className={`border-l-2 border-solid pl-4 pt-2 pb-2 ${borderColorCSS}`}>
      <h3>{title}</h3>
      <PrismCodeBlock language={language}>{children}</PrismCodeBlock>
    </div>
  );
}

export default function LanguageDemo() {
  const [text, setText] = useState(initialText);
  const [response, setResponse] = useState(() => getResponse(initialText));

  return (
    <div className="m-4 border border-solid border-gray-300 bg-white p-4">
      <h2 id="demo">Demo</h2>
      <div>
        <div style={{ backgroundColor: (theme.plain as Record<string, string>).backgroundColor }}>
          <PrismCodeEditor code={text} onCodeChange={setText} />
        </div>
        <button
          type="button"
          className="mx-0 my-1 block w-full rounded-md border-0 bg-gray-200 p-2 font-bold leading-normal hover:bg-gray-100"
          onClick={() => setResponse(getResponse(text))}
          onKeyDown={() => setResponse(getResponse(text))}
        >
          Submit Your Program
        </button>
      </div>
      <div className="mt-4">
        {response.__type__ === 'ERROR' ? (
          <DemoResult title="Errors" borderColorCSS="border-red-500">
            {response.errors.join('\n')}
          </DemoResult>
        ) : (
          <>
            {response.emittedTSCode && (
              <DemoResult
                title="Optimized TypeScript"
                language="typescript"
                borderColorCSS="border-gray-400"
              >
                {response.emittedTSCode.trim()}
              </DemoResult>
            )}
            {response.interpreterResult && (
              <DemoResult title="Program Standard Out" borderColorCSS="border-green-500">
                {response.interpreterResult.trim()}
              </DemoResult>
            )}
          </>
        )}
      </div>
      <div className="w-full">
        <a className="mx-0 my-4 block text-center" href="/">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
