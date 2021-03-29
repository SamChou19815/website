const path = require('path');

const { ProvidePlugin } = require('webpack');

const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getThemePath() {
    return path.join(__dirname, 'theme');
  },
  getClientModules() {
    return [require.resolve('lib-react/PrismCodeBlock.css')];
  },
  configureWebpack(config) {
    config.plugins.push(new ProvidePlugin({ React: 'react' }));
    return true;
  },
});

module.exports = setupPlugin;
