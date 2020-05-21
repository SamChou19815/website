/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactElement } from 'react';

import InputCard from './InputCard';
import styles from './LanguageDemo.module.css';
import ResultCard from './ResultCard';
import { initialText, runDemo, Response } from './demo';

const initialDemoResult = runDemo(initialText);

/** The component of the language demo. */
export default function LanguageDemo(): ReactElement {
  const [response, setResponse] = React.useState<Response | string>(initialDemoResult);

  const onSubmit = (programString: string): void => {
    try {
      const demoResult = runDemo(programString);
      setResponse(demoResult);
    } catch (interpreterError) {
      setResponse(interpreterError.name || 'Unknown interpreter error.');
    }
  };

  return (
    <div className={styles.LanguageDemo}>
      <InputCard onSubmit={onSubmit} />
      <ResultCard response={response} />
    </div>
  );
}
