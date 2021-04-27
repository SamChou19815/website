import { resolvePackageEntry } from './pnp-resolution';

const packageJson0 = {
  module: 'dist/module-module.mjs',
  main: 'dist/main-require.js',
};

const packageJson1 = {
  ...packageJson0,
  exports: {
    '.': { import: './dist/module.mjs', require: './dist/require.js' },
    './lite': { browser: './lite/module.mjs', require: './lite/require.js' },
  },
};

it('resolvePackageEntry test 1', () => {
  expect(resolvePackageEntry(packageJson0, '.', true)).toBe('./dist/module-module.mjs');
  expect(resolvePackageEntry(packageJson0, '.', false)).toBe('./dist/main-require.js');
  expect(resolvePackageEntry(packageJson0, './lite', true)).toBeNull();
  expect(resolvePackageEntry(packageJson0, './lite', false)).toBeNull();
});

it('resolvePackageEntry test 2', () => {
  expect(resolvePackageEntry(packageJson1, '.', true)).toBe('./dist/module.mjs');
  expect(resolvePackageEntry(packageJson1, '.', false)).toBe('./dist/require.js');
  expect(resolvePackageEntry(packageJson1, './lite', true)).toBe('./lite/module.mjs');
  expect(resolvePackageEntry(packageJson1, './lite', false)).toBe('./lite/require.js');
});
