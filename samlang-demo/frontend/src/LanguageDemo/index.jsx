// @flow strict

import type { Node } from 'react';
import React from 'react';
import styles from './LanguageDemo.module.css';
import ResultCard from './ResultCard';
import InputCard from './InputCard';
import interpret from './interpret';

/**
 * The component of the language demo.
 */
export default function LanguageDemo(): Node {
  const [response, setResponse] = React.useState(null);

  const onSubmit = (programString: string): void => {
    interpret(programString)
      .then(resp => setResponse(resp))
      .catch(() => setResponse('server-error'));
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
