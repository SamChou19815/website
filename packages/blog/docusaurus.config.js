/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = require('lib-react/prism-theme.json');

module.exports = {
  title: 'Blog',
  tagline: 'Developer Sam Blog',
  url: 'https://blog.developersam.com',
  organizationName: 'SamChou19815',
  projectName: 'website',
  baseUrl: '/',
  favicon: 'https://developersam.com/favicon.ico',
  themeConfig: {
    disableDarkMode: true,
    prism: { theme },
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
    googleAnalytics: { trackingID: 'UA-140662756-1' },
    gtag: { trackingID: 'UA-140662756-1' },
  },
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        blog: {
          path: './blog',
          routeBasePath: '/',
          editUrl: 'https://github.com/SamChou19815/website/edit/master/packages/blog/',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Developer Sam.`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          cacheTime: 600 * 1000,
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
  plugins: [require.resolve('lib-docusaurus-plugin')],
};
