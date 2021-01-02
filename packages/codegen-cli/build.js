#!/usr/bin/env node

const { chmodSync, mkdirSync, writeFileSync } = require('fs');
const { dirname, join, resolve } = require('path');

const ncc = require('@vercel/ncc');

ncc(join(resolve('.'), 'src', 'index.ts'), {
  minify: true,
  sourceMapRegister: false,
  transpileOnly: true,
  quiet: true,
}).then((/** @type {{code: string}} */ { code }) => {
  const outputPath = join('bin', 'index');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, code);
  chmodSync(outputPath, 0o755);
});
