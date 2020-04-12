/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

const { removeModuleScopePlugin, override, babelInclude } = require('customize-cra');

const libraries = require('./libraries.json');

const getPathsToResolve = () => ['src', ...libraries.map((library) => `../${library}`)];

const getResolvedPath = () => getPathsToResolve().map((relativePath) => path.resolve(relativePath));

module.exports = (...additionalPlugins) =>
  override(removeModuleScopePlugin(), babelInclude(getResolvedPath()), ...additionalPlugins);
