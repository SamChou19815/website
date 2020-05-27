/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const darkTheme = require('prism-react-renderer/themes/dracula');

const theme = require('lib-react/prism-theme.json');

module.exports = {
  title: 'SAMLANG',
  tagline: "Sam's Programming Language",
  url: 'https://samlang.developersam.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'SamChou19815',
  projectName: 'samlang',
  themeConfig: {
    prism: {
      theme,
      darkTheme,
    },
    navbar: {
      title: 'SAMLANG',
      logo: {
        alt: 'SAMLANG Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/introduction', label: 'Docs', exact: true, position: 'left' },
        { to: 'demo', label: 'Demo', exact: true, position: 'left' },
        { to: 'blog', label: 'Blog', exact: true, position: 'left' },
        {
          href: 'https://github.com/SamChou19815/samlang',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/introduction',
            },
            {
              label: 'Expressions',
              to: 'docs/expressions',
            },
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/SamChou19815/samlang',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/SamChou19815/samlang/issues',
            },
          ],
        },
        {
          title: 'Relevent Links',
          items: [
            {
              label: 'Demo',
              to: 'demo',
            },
            {
              label: 'Developer Sam',
              href: 'https://developersam.com',
            },
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
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SamChou19815/website/edit/master/packages/samlang/',
        },
        blog: {
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Developer Sam.`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [require.resolve('lib-docusaurus-plugin')],
};
