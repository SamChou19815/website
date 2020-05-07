/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

const path = require('path');

/** @typedef { import('@docusaurus/types').Plugin<void> } Plugin */

/** @type {Plugin} */
const plugin = {
  name: 'lib-docusaurus-prism-extended-plugin',
  getClientModules() {
    return [path.resolve(__dirname, './prism-include-languages')];
  },
};

module.exports = () => plugin;
