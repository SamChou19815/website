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
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import theme from 'lib-react-prism/prism-theme.json';
import React, { useState } from 'react';

import PrismCodeEditor from './PrismCodeEditor';

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

export default function LanguageDemo() {
  const [text, setText] = useState(initialText);
  const [response, setResponse] = useState(() => getResponse(initialText));

  return (
    <div className="language-demo">
      <h2 id="demo">Demo</h2>
      <div className="card">
        <div
          className="editor-card-container"
          style={{ backgroundColor: (theme.plain as Record<string, string>).backgroundColor }}
        >
          <PrismCodeEditor language="samlang" code={text} theme={theme} onCodeChange={setText} />
        </div>
        <div className="editor-card-submit-button-container">
          <button
            type="button"
            className="editor-card-submit-button"
            onClick={() => setResponse(getResponse(text))}
          >
            Submit Your Program
          </button>
        </div>
      </div>
      <div className="language-demo-results">
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
                <PrismCodeBlock language="">{response.interpreterResult.trim()}</PrismCodeBlock>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
