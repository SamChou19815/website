// @ts-check

/** @returns {import('@docusaurus/types').Plugin<void>} */
const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getClientModules() {
    return [require.resolve('./prism-include-languages')];
  },
});

module.exports = setupPlugin;
