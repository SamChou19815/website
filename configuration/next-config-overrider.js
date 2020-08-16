const withTM = require('next-transpile-modules');

const libraries = require('./libraries.json');

module.exports = (additionalConfigurations = {}) =>
  withTM(libraries)({
    webpack(config) {
      // eslint-disable-next-line no-param-reassign
      config.node = { fs: 'empty', child_process: 'empty' };
      return config;
    },
    ...additionalConfigurations,
  });
