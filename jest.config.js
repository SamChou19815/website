// eslint-disable-next-line @typescript-eslint/no-require-imports
const libraries = require('./configuration/libraries.json');

const babelJestPath = require.resolve('babel-jest');
const identityObjectProxyPath = require.resolve('identity-obj-proxy');

module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
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
