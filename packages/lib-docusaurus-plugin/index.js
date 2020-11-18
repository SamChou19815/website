// @ts-check
const path = require('path');

/** @returns {import('@docusaurus/types').Plugin<void>} */
const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getThemePath() {
    return path.join(__dirname, 'theme');
  },
  getClientModules() {
    return [require.resolve('lib-react/PrismCodeBlock.css')];
  },
});

module.exports = setupPlugin;
