const withEsbuild = require('lib-next-with-esbuild');

module.exports = require('next-transpile-modules')([
  'lib-common',
  'lib-in-memory-filesystem',
  'lib-web-terminal',
  'lib-react',
])(withEsbuild());
