module.exports = require('next-transpile-modules')(['lib-react'])({
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.node = { fs: 'empty', child_process: 'empty' };
    return config;
  },
});
