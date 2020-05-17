import React, { ReactElement } from 'react';

import InputCard from './InputCard';
import styles from './LanguageDemo.module.css';
import ResultCard from './ResultCard';
import interpret, { Response } from './interpret';

/**
 * The component of the language demo.
 */
export default function LanguageDemo(): ReactElement {
  const [response, setResponse] = React.useState<Response | 'error' | null>(null);

  const onSubmit = (programString: string): void => {
    try {
      setResponse(interpret(programString));
    } catch (interpreterError) {
      setResponse(interpreterError.name ?? 'Unknown interpreter error.');
    }
  };

  return (
    <div className={styles.LanguageDemo}>
      <InputCard onSubmit={onSubmit} />
      <ResultCard response={response} />
    </div>
  );
}
