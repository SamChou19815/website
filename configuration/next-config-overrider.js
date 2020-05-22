/* eslint-disable @typescript-eslint/no-require-imports */
const withTM = require('next-transpile-modules');

const libraries = require('./libraries.json');

module.exports = (additionalConfigurations = {}) =>
  withTM(libraries)({
    webpack(config) {
      // eslint-disable-next-line no-param-reassign
      config.node = {
        fs: 'empty',
        child_process: 'empty',
      };
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: require.resolve('worker-loader'),
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      });
      // eslint-disable-next-line no-param-reassign
      config.output.globalObject = 'self';
      return config;
    },
    ...additionalConfigurations,
  });
