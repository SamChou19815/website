const libraries = require('./configuration/libraries.json');

const babelJestPath = require.resolve('babel-jest');
const identityObjectProxyPath = require.resolve('identity-obj-proxy');

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': babelJestPath,
  },
  transformIgnorePatterns: [
    `/node_modules/(?!(${libraries.join('|')})).+\\.js$`,
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': identityObjectProxyPath,
  },
};
