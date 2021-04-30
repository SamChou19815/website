/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = require('lib-react-prism/prism-theme.json');

module.exports = {
  title: 'samlang',
  tagline: "Sam's Programming Language",
  url: 'https://samlang.io',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'SamChou19815',
  projectName: 'samlang',
  themeConfig: {
    prism: { theme },
    algolia: { apiKey: '1406f5568da6a64e7791f113bbf9148e', indexName: 'developersam_samllang' },
    navbar: {
      title: 'samlang',
      logo: { alt: 'samlang logo', src: 'img/logo.svg' },
      items: [
        { to: 'docs/introduction', label: 'Docs', position: 'left' },
        { to: 'demo', label: 'Demo', position: 'left' },
        { href: 'https://github.com/SamChou19815/samlang', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: 'docs/introduction' },
            { label: 'Expressions', to: 'docs/expressions' },
          ],
        },
        {
          title: 'GitHub',
          items: [
            { label: 'GitHub', href: 'https://github.com/SamChou19815/samlang' },
            { label: 'GitHub Issues', href: 'https://github.com/SamChou19815/samlang/issues' },
          ],
        },
        {
          title: 'Relevent Links',
          items: [
            { label: 'Demo', to: 'demo' },
            { label: 'Developer Sam', href: 'https://developersam.com' },
          ],
        },
      ],
      copyright: `Copyright © 2018-${new Date().getFullYear()} Developer Sam. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.json'),
          editUrl: 'https://github.com/SamChou19815/website/edit/main/packages/samlang/',
        },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],
  plugins: [require.resolve('lib-docusaurus-plugin')],
};
