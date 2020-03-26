/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Blog',
  tagline: 'Developer Sam Blog',
  url: 'https://blog.developersam.com',
  organizationName: 'SamChou19815',
  projectName: 'website',
  baseUrl: '/',
  favicon: 'https://developersam.com/favicon.ico',
  themeConfig: {
    navbar: {
      title: 'Developer Sam Blog',
      links: [
        {
          href: 'https://developersam.com/',
          label: 'Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/SamChou19815',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © 2016-${new Date().getFullYear()} Developer Sam.`,
    },
  },
  themes: [['@docusaurus/theme-classic', { customCss: require.resolve('./src/css/custom.css') }]],
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        postsPerPage: 10,
        routeBasePath: '/',
      },
    ],
  ],
};
