const { ESBuildMinifyPlugin } = require('esbuild-loader');

const withEsbuildMinify = (config, options) => {
  const terserIndex = config.optimization.minimizer.findIndex(
    (minimizer) => minimizer.constructor.name === 'TerserPlugin'
  );
  if (terserIndex > -1) {
    config.optimization.minimizer.splice(terserIndex, 1, new ESBuildMinifyPlugin(options));
  }
};

const withEsbuildLoader = (config, options) => {
  const jsLoader = config.module.rules.find((rule) => rule.test && rule.test.test('.js'));
  if (jsLoader) {
    jsLoader.use.loader = require.resolve('esbuild-loader');
    jsLoader.use.options = options;
  }
};

const withEsbuild = () => ({
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.ProvidePlugin({ React: 'react' }));
    withEsbuildMinify(config, { target: 'es2017' });
    withEsbuildLoader(config, { loader: 'tsx', target: 'es2017' });
    return config;
  },
});

module.exports = withEsbuild;
