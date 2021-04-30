const path = require('path');

const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getThemePath() {
    return path.join(__dirname, 'theme');
  },
  getClientModules() {
    return [require.resolve('lib-react-prism/PrismCodeBlock.css')];
  },
});

module.exports = setupPlugin;
