const setupPlugin = () => ({
  name: 'docusaurus-infima-css-plugin',
  getClientModules() {
    return [require.resolve('infima/dist/css/default/default.css')];
  },
});

module.exports = setupPlugin;
