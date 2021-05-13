/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runSamlangDemo from '@dev-sam/samlang-demo';
import React, { useState } from 'react';

import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import PrismCodeEditor from 'lib-react-prism/PrismCodeEditor';
import theme from 'lib-react-prism/prism-theme.json';

type Response = ReturnType<typeof runSamlangDemo>;

const initialText = `/* Start to type your program */
// Add your comments!
// Press enter to add a new line.

class Main {
  function main(): unit = println("Hello World!")
}
`;

const getResponse = (programString: string): Response | string => {
  try {
    return runSamlangDemo(programString);
  } catch (interpreterError) {
    return interpreterError.message || 'Unknown interpreter error.';
  }
};

const LanguageDemo = () => {
  const [text, setText] = useState(initialText);
  const [response, setResponse] = useState(() => getResponse(initialText));

  return (
    <div className="language-demo">
      <div className="card parallel-card editor-card">
        <div
          className="card__body editor-card-container"
          style={{ backgroundColor: (theme.plain as Record<string, string>).backgroundColor }}
        >
          <PrismCodeEditor language="samlang" code={text} theme={theme} onCodeChange={setText} />
        </div>
        <div className="card__footer">
          <button
            type="button"
            className="button button--secondary button--block"
            onClick={() => setResponse(getResponse(text))}
          >
            Submit Your Program
          </button>
        </div>
      </div>
      <div className="card parallel-card">
        <div className="card__body">
          {typeof response === 'string' ? (
            <div>
              <div className="colored-result bad-result">
                <h3>Interpreter Error</h3>
                <code>{response}</code>
              </div>
            </div>
          ) : (
            <div>
              {response.interpreterPrinted && (
                <div className="colored-result good-result">
                  <h3>Program Standard Out:</h3>
                  <PrismCodeBlock language="">{response.interpreterPrinted}</PrismCodeBlock>
                </div>
              )}
              {response.prettyPrintedProgram && (
                <div className="colored-result good-result">
                  <h3>Pretty Printed Program:</h3>
                  <PrismCodeBlock language="samlang">
                    {response.prettyPrintedProgram.trim()}
                  </PrismCodeBlock>
                </div>
              )}
              {response.jsString && (
                <div className="colored-result neutral-result">
                  <h3>Compiled JS:</h3>
                  <PrismCodeBlock language="javascript">{response.jsString.trim()}</PrismCodeBlock>
                </div>
              )}
              {response.llvmString && (
                <div className="colored-result neutral-result">
                  <h3>Optimized LLVM Code:</h3>
                  <PrismCodeBlock language="llvm">{response.llvmString.trim()}</PrismCodeBlock>
                </div>
              )}
              {response.errors.length > 0 && (
                <div className="colored-result bad-result">
                  <h3>Compile Time Errors:</h3>
                  <PrismCodeBlock language="">{response.errors.join('\n')}</PrismCodeBlock>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Demo = (): JSX.Element => {
  return (
    <>
      <HeadTitle title="samlang Demo" />
      <LanguageDemo />
    </>
  );
};

export default Demo;
