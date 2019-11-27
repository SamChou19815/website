import React, { ReactElement } from 'react';
import styles from './LanguageDemo.module.css';
import ResultCard from './ResultCard';
import InputCard from './InputCard';
import interpret, { Response } from './interpret';

type Resp = Response | 'waiting' | 'server-error' | null;

/**
 * The component of the language demo.
 */
export default function LanguageDemo(): ReactElement {
  const [response, setResponse] = React.useState<Resp>(null);

  const onSubmit = (programString: string): void => {
    interpret(programString)
      .then((resp): void => setResponse(resp))
      .catch((): void => setResponse('server-error'));
    setResponse('waiting');
  };

  return (
    <div className={styles.LanguageDemo}>
      <InputCard onSubmit={onSubmit} />
      <ResultCard response={response} />
      {response === 'waiting' && <div className={styles.Blocker} />}
    </div>
  );
}
