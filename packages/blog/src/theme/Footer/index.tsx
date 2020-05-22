/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactElement } from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import classnames from 'classnames';

export default (): ReactElement => {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { themeConfig = {} } = siteConfig;
  const { footer } = themeConfig;

  if (!footer) {
    return null;
  }

  const { copyright } = footer;

  return <footer className={classnames('footer', { 'footer--dark': true })}>{copyright}</footer>;
};
