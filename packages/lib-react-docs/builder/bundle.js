// @ts-check

const { join } = require('path');

require('esbuild-scripts/bundler/api')(
  /* entryPoint */ join('builder', 'generator.ts'),
  /* outFile */ join('builder', 'generator.js'),
  /* externals */ ['esbuild-scripts']
);
