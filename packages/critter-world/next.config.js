const withEsbuild = require('lib-next-with-esbuild');

module.exports = require('next-transpile-modules')(['lib-common', 'lib-react'])(withEsbuild());
