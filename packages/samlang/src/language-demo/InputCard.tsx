/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, ReactElement } from 'react';

import usePrismTheme from '@theme/hooks/usePrismTheme';
import clsx from 'clsx';

import styles from './LanguageDemo.module.css';
import { initialText } from './demo';

import PrismCodeEditor from 'lib-react/PrismCodeEditor';

type Props = { readonly onSubmit: (code: string) => void };

const rootClassName = [styles.ParallelCard, styles.EditorCard].join(' ');

/** The component of the language demo input. */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const theme = usePrismTheme();
  const [text, setText] = useState<string>(initialText);
  return (
    <div className={clsx('card', rootClassName)}>
      <div
        className={clsx('card__body', styles.EditorCardContainer)}
        style={{ backgroundColor: theme.plain.backgroundColor }}
      >
        <PrismCodeEditor language="samlang" code={text} theme={theme} onCodeChange={setText} />
      </div>
      <div className="card__footer">
        <button
          type="button"
          className="button button--secondary button--block"
          onClick={() => onSubmit(text)}
        >
          Submit Your Program
        </button>
      </div>
    </div>
  );
}
