/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const darkTheme = require('prism-react-renderer/themes/dracula');

const theme = require('lib-react/prism-theme.json');

module.exports = {
  title: 'Vault @ dev-sam',
  tagline: "Sam's Vault",
  url: 'https://vault.developersam.com',
  baseUrl: '/',
  favicon: 'https://developersam.com/favicon.ico',
  organizationName: 'SamChou19815',
  projectName: 'samlang',
  themeConfig: {
    disableDarkMode: true,
    prism: {
      theme,
      darkTheme,
    },
    navbar: {
      title: 'Vault',
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
          // sidebarPath: require.resolve('./sidebars.json'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [require.resolve('lib-docusaurus-plugin')],
};
