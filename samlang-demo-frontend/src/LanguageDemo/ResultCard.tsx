import React, { ReactNode, ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CodeBlock, { initialize } from 'sam-highlighter';
import { Response } from './interpret';
import DemoStyles from './LanguageDemo.module.css';
import ResultStyles from './ResultCard.module.css';

type Props = {
  readonly response: Response | 'waiting' | 'server-error' | null;
};

initialize();

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
              <code>{result}</code>
            </div>
            <div>
              <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'green' }}>
                <h3>Pretty Printed Program:</h3>
                <CodeBlock language="samlang">{prettyPrintedProgram}</CodeBlock>
              </div>
            </div>
          </div>
        );
        break;
      }
      case 'BAD_SYNTAX':
        children = (
          <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'red' }}>
            <code>{response.detail}</code>
          </div>
        );
        break;
      case 'BAD_TYPE':
        children = (
          <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'red' }}>
            <code>{response.detail}</code>
          </div>
        );
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
