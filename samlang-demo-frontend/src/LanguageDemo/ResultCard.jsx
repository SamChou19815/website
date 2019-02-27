// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Card from '@material-ui/core/Card';
// $FlowFixMe
import CardContent from '@material-ui/core/CardContent';
// $FlowFixMe
import CardHeader from '@material-ui/core/CardHeader';
import type { Response } from './interpret';
import DemoStyles from './LanguageDemo.module.css';
import ResultStyles from './ResultCard.module.css';

type Props = {|
  +response: Response | 'waiting' | 'server-error' | null;
|};

/**
 * The component of the language demo.
 */
export default function ResultCard({ response }: Props): Node {
  let children: Node;
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
                <code><pre>{prettyPrintedProgram}</pre></code>
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
