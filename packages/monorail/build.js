// @ts-check
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const terser = require('terser');
const webpack = require('webpack');

console.log('[*] Compiling...');

const getCompiler = () => {
  const compiler = webpack({
    entry: [path.join(__dirname, '/src/index.ts')],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-typescript',
            ],
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts'],
    },
    target: 'node',
    mode: 'production',
    output: {
      filename: 'monorail',
      path: path.join(__dirname, 'bin'),
    },
  });

  compiler.run(() => {});

  return compiler;
};

/**
 * @param {string} source
 */
const minify = (source) =>
  terser.minify(source, {
    compress: false,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
    sourceMap: false,
  }).code;

getCompiler().hooks.done.tap('done', (stats) => {
  if (stats.hasWarnings()) {
    console.error('[!] `@dev-sam/monorail` has compiler warnings!');
    stats.toJson().warnings.map((line) => console.warn(line));
  }
  if (stats.hasErrors()) {
    stats.toJson().errors.map((line) => console.error(line));
    console.error('\n[x] `@dev-sam/monorail` has compiler errors!');
    process.exit(1);
  }

  // Prepend shebang
  const outputFile = path.join(__dirname, 'bin', 'monorail');
  fs.writeFileSync(
    outputFile,
    `#!/usr/bin/env node\n${minify(fs.readFileSync(outputFile).toString())}`
  );

  console.log('[✓] `@dev-sam/monorail` has been compiled!');
  process.exit(0);
});
