/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Layout from '@theme/Layout';
import React, { ReactElement } from 'react';

import LanguageDemo from '../language-demo';

const title = 'samlang Demo';
const description =
  'A web-based samlang demo with type checker, interpreter, and compiler running in browser';

function Demo(): ReactElement {
  return (
    <Layout title={title} description={description}>
      <LanguageDemo />
    </Layout>
  );
}

export default Demo;
