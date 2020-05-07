/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const theme = require('lib-react/prims-theme.json');

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
    },
    navbar: {
      title: 'SAMLANG',
      logo: {
        alt: 'SAMLANG Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/introduction', label: 'Docs', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
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
              label: 'Classes & Types',
              to: 'docs/classes-types',
            },
            {
              label: 'Expressions',
              to: 'docs/expressions',
            },
            {
              label: 'Type Inference',
              to: 'type-inference',
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
            {
              label: 'GitHub Pull Requests',
              href: 'https://github.com/SamChou19815/samlang/pulls',
            },
          ],
        },
        {
          title: 'Relevent Links',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'Demo',
              href: 'https://samlang-demo.developersam.com',
            },
            {
              label: 'Developer Sam',
              href: 'https://developersam.com',
            },
            {
              label: 'Developer Sam Blog',
              href: 'https://blog.developersam.com',
            },
          ],
        },
      ],
      copyright: `Copyright © 2018-${new Date().getFullYear()} Developer Sam. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: ['lib-docusaurus-prism-extended-plugin'],
};
