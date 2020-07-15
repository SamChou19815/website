/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = require('lib-react/prism-theme.json');

module.exports = {
  title: 'Wiki',
  tagline: process.env.DEV_SAM
    ? 'Public and private documentation for dev-sam'
    : 'Public documentation for dev-sam',
  url: process.env.DEV_SAM ? 'https://intern.developersam.com' : 'https://wiki.developersam.com',
  baseUrl: '/',
  favicon: 'https://developersam.com/favicon.ico',
  themeConfig: {
    prism: { theme },
    algolia: process.env.DEV_SAM && {
      apiKey: process.env.ALGOLIA_PRIVATE_SEARCH_KEY,
      indexName: 'dev-sam-intern',
    },
    navbar: {
      title: 'Wiki',
      links: [],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © 2020-${new Date().getFullYear()} Developer Sam. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        docs: {
          sidebarPath: process.env.DEV_SAM
            ? require.resolve('./docs/private-docs/private-sidebars.json')
            : require.resolve('./sidebars.json'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [require.resolve('lib-docusaurus-plugin')],
};
