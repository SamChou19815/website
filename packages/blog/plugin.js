module.exports = () => ({
  name: 'lib-docusaurus-plugin',
  getClientModules() {
    return [require.resolve('lib-react-prism/PrismCodeBlock.css')];
  },
});
