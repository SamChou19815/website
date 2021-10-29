/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  SamlangSingleSourceCompilationResult,
  compileSingleSamlangSource,
} from '@dev-sam/samlang-core';
import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import PrismCodeEditor from 'lib-react-prism/PrismCodeEditor';
import theme from 'lib-react-prism/prism-theme.json';
import React, { useState } from 'react';

const initialText = `/* Start to type your program */
// Add your comments!
// Press enter to add a new line.

class Main {
  function main(): unit = Builtins.println("Hello World!")
}
`;

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

function LanguageDemo() {
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
          {response.__type__ === 'ERROR' ? (
            <div>
              <div className="colored-result bad-result">
                <h3>Errors:</h3>
                <PrismCodeBlock language="">{response.errors.join('\n')}</PrismCodeBlock>
              </div>
            </div>
          ) : (
            <div>
              {response.emittedTSCode && (
                <div className="colored-result neutral-result">
                  <h3>Optimized TS:</h3>
                  <PrismCodeBlock language="typescript">
                    {response.emittedTSCode.trim()}
                  </PrismCodeBlock>
                </div>
              )}
              {response.interpreterResult && (
                <div className="colored-result good-result">
                  <h3>Program Standard Out:</h3>
                  <PrismCodeBlock language="">{response.interpreterResult}</PrismCodeBlock>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Demo(): JSX.Element {
  return (
    <>
      <HeadTitle title="samlang Demo" />
      <LanguageDemo />
    </>
  );
}
