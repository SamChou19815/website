/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode, ReactElement } from 'react';

import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';

import DemoStyles from './LanguageDemo.module.css';
import ResultStyles from './ResultCard.module.css';
import { Response } from './demo';

const ErrorDetail = ({ children }: { readonly children: readonly string[] }): ReactElement => (
  <div className={`${ResultStyles.ColoredResult} ${ResultStyles.BadResult}`}>
    <h3>Compile Time Errors</h3>
    <CodeBlock>{children.join('\n')}</CodeBlock>
  </div>
);

const AssemblyBlock = ({ children }: { readonly children: string }): ReactElement => (
  <div className={`${ResultStyles.ColoredResult} ${ResultStyles.NeutralResult}`}>
    <h3>Optimized Assembly</h3>
    <CodeBlock>{children.trim()}</CodeBlock>
  </div>
);

type Props = { readonly response: Response | string };

/** The component of the language demo result. */
export default function ResultCard({ response }: Props): ReactElement {
  let children: ReactNode;
  if (typeof response === 'string') {
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
            <CodeBlock>{interpreterResult}</CodeBlock>
          </div>
        )}
        {interpreterPrinted && (
          <div className={`${ResultStyles.ColoredResult} ${ResultStyles.GoodResult}`}>
            <h3>Program Standard Out</h3>
            <CodeBlock>{interpreterPrinted}</CodeBlock>
          </div>
        )}
        {prettyPrintedProgram && (
          <div className={ResultStyles.ColoredResult} style={{ borderLeftColor: 'green' }}>
            <h3>Pretty Printed Program:</h3>
            <CodeBlock className="samlang">{prettyPrintedProgram.trim()}</CodeBlock>
          </div>
        )}
        {assemblyString && <AssemblyBlock>{assemblyString}</AssemblyBlock>}
        {errors.length > 0 && <ErrorDetail>{errors}</ErrorDetail>}
      </div>
    );
  }
  return (
    <div className={clsx('card', DemoStyles.ParallelCard)}>
      <div className="card__body">{children}</div>
    </div>
  );
}
