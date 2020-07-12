// @ts-check

/** @returns {import('@docusaurus/types').Plugin<void>} */
const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getClientModules() {
    return [
      require.resolve('./prism-include-languages'),
      require.resolve('lib-react/PrismCodeBlock.css'),
    ];
  },
});

module.exports = setupPlugin;
