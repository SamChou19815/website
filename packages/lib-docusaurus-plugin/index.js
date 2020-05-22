/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const path = require('path');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PnpWebpackPlugin = require('pnp-webpack-plugin');

/** @typedef { import('@docusaurus/types').Plugin<void> } Plugin */

/** @type {Plugin} */
const plugin = {
  name: 'lib-docusaurus-prism-extended-plugin',
  getClientModules() {
    return [path.resolve(__dirname, './prism-include-languages')];
  },
  configureWebpack() {
    return {
      resolve: {
        plugins: [PnpWebpackPlugin],
      },
      resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
      },
    };
  },
};

module.exports = () => plugin;
