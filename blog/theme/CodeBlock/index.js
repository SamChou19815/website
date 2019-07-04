/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CodeBlock, { initialize } from 'sam-highlighter';

import styles from './styles.module.css';

initialize();

export default ({ children, className: languageClassName }) => {
  const language = languageClassName && languageClassName.replace(/language-/, '');
  return (
    <CodeBlock language={language} className={styles.CodeBlock}>
      {children}
    </CodeBlock>
  );
};
