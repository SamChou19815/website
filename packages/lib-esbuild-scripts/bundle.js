/* eslint-disable no-console */
// @ts-check

const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const { build } = require('esbuild');

build({
  entryPoints: ['index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node12',
  format: 'iife',
  outfile: 'index.js',
  banner: { js: `#!/usr/bin/env node\n/* eslint-disable */\n// prettier-ignore` },
  plugins: [
    pnpPlugin({
      async onResolve(_, resolvedPath) {
        if (resolvedPath == null) return { external: true };
        if (resolvedPath.includes('esbuild-npm')) return { external: true };
        return { namespace: `pnp`, path: resolvedPath };
      },
    }),
  ],
})
  .then(({ warnings }) => {
    warnings.forEach((warning) => console.error(`[!] ${warning.text}`));
  })
  .catch(() => process.exit(1));
