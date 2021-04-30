/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runSamlangDemo from '@dev-sam/samlang-demo';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import usePrismTheme from '@theme/hooks/usePrismTheme';
import React, { useState } from 'react';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

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
  const theme = usePrismTheme();
  const [text, setText] = useState(initialText);
  const [response, setResponse] = useState(() => getResponse(initialText));

  return (
    <div className="language-demo">
      <div className="card parallel-card editor-card">
        <div
          className="card__body editor-card-container"
          style={{ backgroundColor: theme.plain.backgroundColor }}
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
                  <CodeBlock>{response.interpreterPrinted}</CodeBlock>
                </div>
              )}
              {response.prettyPrintedProgram && (
                <div className="colored-result good-result">
                  <h3>Pretty Printed Program:</h3>
                  <CodeBlock className="samlang">{response.prettyPrintedProgram.trim()}</CodeBlock>
                </div>
              )}
              {response.jsString && (
                <div className="colored-result neutral-result">
                  <h3>Compiled JS:</h3>
                  <CodeBlock className="javascript">{response.jsString.trim()}</CodeBlock>
                </div>
              )}
              {response.llvmString && (
                <div className="colored-result neutral-result">
                  <h3>Optimized LLVM Code:</h3>
                  <CodeBlock className="llvm">{response.llvmString.trim()}</CodeBlock>
                </div>
              )}
              {response.errors.length > 0 && (
                <div className="colored-result bad-result">
                  <h3>Compile Time Errors:</h3>
                  <CodeBlock>{response.errors.join('\n')}</CodeBlock>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Demo(): JSX.Element {
  return (
    <Layout
      title="samlang Demo"
      description="A web-based samlang demo with type checker, interpreter, and compiler running in browser."
    >
      <LanguageDemo />
    </Layout>
  );
}

export default Demo;
