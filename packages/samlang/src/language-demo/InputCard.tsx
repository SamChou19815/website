/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Editor from './Editor';
import styles from './LanguageDemo.module.css';
import { initialText } from './demo';

type Props = { readonly onSubmit: (code: string) => void };

const rootClassName = [styles.ParallelCard, styles.EditorCard].join(' ');

/** The component of the language demo input. */
export default function InputCard({ onSubmit }: Props): ReactElement {
  const [text, setText] = useState<string>(initialText);
  return (
    <Card className={rootClassName}>
      <CardContent className={styles.EditorCardContainer}>
        <Editor code={text} onCodeChange={setText} />
      </CardContent>
      <CardActions>
        <Button size="medium" color="primary" onClick={() => onSubmit(text)}>
          Submit Your Program
        </Button>
      </CardActions>
    </Card>
  );
}
