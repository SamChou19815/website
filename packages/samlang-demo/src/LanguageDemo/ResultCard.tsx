import React, { ReactNode, ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CodeBlock from 'lib-react/PrismCodeBlock';

import DemoStyles from './LanguageDemo.module.css';
import ResultStyles from './ResultCard.module.css';
import { Response } from './interpret';

const ErrorDetail = ({ children }: { readonly children: readonly string[] }): ReactElement => (
  <div className={`${ResultStyles.ColoredResult} ${ResultStyles.BadResult}`}>
    <h3>Compile Time Errors</h3>
    <code>
      {children.map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={index}>{line}</p>
      ))}
    </code>
  </div>
);

const AssemblyBlock = ({ children }: { readonly children: string }): ReactElement => (
  <div className={`${ResultStyles.ColoredResult} ${ResultStyles.NeutralResult}`}>
    <h3>Optimized Assembly</h3>
    <code>
      {children.split('\n').map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={index}>{line}</p>
      ))}
    </code>
  </div>
);

type Props = { readonly response: Response | string | null };

/** The component of the language demo result. */
export default function ResultCard({ response }: Props): ReactElement {
  let children: ReactNode;
  if (response === null) {
    children = 'Submit a program to see the interpretation result.';
  } else if (typeof response === 'string') {
    children = (
      <div>
        <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'red' }}>
          <h3>Interpreter Error</h3>
          <code>{response}</code>
        </div>
      </div>
    );
  } else {
    const {
      interpreterResult,
      interpreterPrinted,
      prettyPrintedProgram,
      assemblyString,
      errors,
    } = response;
    children = (
      <div>
        {interpreterResult && (
          <div className={`${ResultStyles.ColoredResult} ${ResultStyles.GoodResult}`}>
            <h3>Program Running Result</h3>
            <pre>{response.interpreterResult}</pre>
          </div>
        )}
        {interpreterPrinted && (
          <div className={`${ResultStyles.ColoredResult} ${ResultStyles.GoodResult}`}>
            <h3>Program Standard Out</h3>
            <pre>{response.interpreterPrinted}</pre>
          </div>
        )}
        {prettyPrintedProgram && (
          <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'green' }}>
            <h3>Pretty Printed Program:</h3>
            <CodeBlock language="samlang" className={ResultStyles.CodeBlock}>
              {prettyPrintedProgram}
            </CodeBlock>
          </div>
        )}
        {assemblyString && <AssemblyBlock>{assemblyString}</AssemblyBlock>}
        {errors.length > 0 && <ErrorDetail>{errors}</ErrorDetail>}
      </div>
    );
  }
  return (
    <Card className={DemoStyles.ParallelCard}>
      <CardHeader title="Interpretation Result" />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
