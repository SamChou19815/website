import React, { ReactNode, ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CodeBlock from 'lib-react/PrismCodeBlock';

import DemoStyles from './LanguageDemo.module.css';
import ResultStyles from './ResultCard.module.css';
import { Response } from './interpret';

type Props = {
  readonly response: Response | 'waiting' | 'server-error' | null;
};

const ErrorDetail = ({ children }: { readonly children: string }): ReactElement => (
  <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'red' }}>
    <code>
      {children.split('\n').map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={index}>{line}</p>
      ))}
    </code>
  </div>
);

/**
 * The component of the language demo.
 */
export default function ResultCard({ response }: Props): ReactElement {
  let children: ReactNode;
  if (response === null) {
    children = 'Submit a program to see the interpretation result.';
  } else if (response === 'waiting') {
    children = 'Waiting for server response...';
  } else if (response === 'server-error') {
    children = 'Server Error. Please try again.';
  } else {
    switch (response.type) {
      case 'GOOD_PROGRAM': {
        const { result, prettyPrintedProgram } = response.detail;
        const resultNodeStyle = {
          borderLeftColor: result.startsWith('Value') ? 'green' : 'orange',
        };
        children = (
          <div>
            <div className={ResultStyles.ColoredResult} style={resultNodeStyle}>
              <h3>Program Running Result</h3>
              <pre>{result}</pre>
            </div>
            <div>
              <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'green' }}>
                <h3>Pretty Printed Program:</h3>
                <CodeBlock language="samlang" className={ResultStyles.CodeBlock}>
                  {prettyPrintedProgram}
                </CodeBlock>
              </div>
            </div>
          </div>
        );
        break;
      }
      case 'BAD_SYNTAX':
        children = <ErrorDetail>{response.detail}</ErrorDetail>;
        break;
      case 'BAD_TYPE':
        children = <ErrorDetail>{response.detail}</ErrorDetail>;
        break;
      default:
        throw new Error('Bad Response');
    }
  }
  return (
    <Card className={DemoStyles.ParallelCard}>
      <CardHeader title="Interpretation Result" />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
