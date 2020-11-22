/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'TEN',
  tagline: 'TEN',
  url: 'https://ten.developersam.com',
  organizationName: 'SamChou19815',
  projectName: 'website',
  baseUrl: '/',
  favicon: '/favicon.ico',
  plugins: [
    require.resolve('@docusaurus/plugin-content-pages'),
    require.resolve('./docusaurus-plugin'),
  ],
};
