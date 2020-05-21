/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';

import LanguageDemo from '../language-demo';

function Demo() {
  return (
    <Layout
      title="SAMLANG Demo"
      description="A web-based samlang demo with type checker, interpreter, and compiler running in browser"
    >
      <LanguageDemo />
    </Layout>
  );
}

export default Demo;
