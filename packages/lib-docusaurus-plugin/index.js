const path = require('path');

const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');
const { ProvidePlugin } = require('webpack');

const withEsbuildMinify = (config) => {
  if (!config.optimization.minimizer) return;
  const terserIndex = config.optimization.minimizer.findIndex(
    (minimizer) => minimizer.constructor.name === 'TerserPlugin'
  );
  if (terserIndex > -1) {
    config.optimization.minimizer.splice(terserIndex, 1, new ESBuildMinifyPlugin());
  }
};

const withEsbuildLoader = (config) => {
  const jsLoader = config.module.rules.find((rule) => rule.test && rule.test.test('.js'));
  if (jsLoader) {
    jsLoader.use[1] = {
      loader: require.resolve('esbuild-loader'),
      options: { loader: 'tsx', format: 'cjs', target: 'es2015' },
    };
  }
};

const setupPlugin = () => ({
  name: 'lib-docusaurus-plugin',
  getThemePath() {
    return path.join(__dirname, 'theme');
  },
  getClientModules() {
    return [require.resolve('lib-react/PrismCodeBlock.css')];
  },
  configureWebpack(config) {
    config.plugins.push(new ESBuildPlugin(), new ProvidePlugin({ React: 'react' }));
    withEsbuildMinify(config);
    withEsbuildLoader(config);
    return true;
  },
});

module.exports = setupPlugin;
