/* eslint-disable no-console */
// @ts-check

const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const { build } = require('esbuild');

build({
  entryPoints: ['index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'es2019',
  format: 'iife',
  outfile: 'index.js',
  banner: {
    js: `#!/usr/bin/env node --unhandled-rejections=strict\n/* eslint-disable */\n// prettier-ignore`,
  },
  plugins: [
    pnpPlugin({
      async onResolve(_, resolvedPath) {
        if (
          resolvedPath == null ||
          resolvedPath.includes('esbuild-npm') ||
          resolvedPath.includes('node-html-parser-npm') ||
          resolvedPath.includes('html-minifier-npm') ||
          resolvedPath.includes('sass-npm') ||
          resolvedPath.includes('@yarnpkg-esbuild-plugin-pnp')
        ) {
          return { external: true };
        }
        return { namespace: `pnp`, path: resolvedPath };
      },
    }),
  ],
})
  .then(({ warnings }) => {
    warnings.forEach((warning) => console.error(`[!] ${warning.text}`));
  })
  .catch(() => process.exit(1));
