/* eslint-disable no-console */
// @ts-check

const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const { build } = require('esbuild');

build({
  entryPoints: ['generator.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'es2019',
  format: 'cjs',
  outfile: 'generator.js',
  banner: {
    js: `/* eslint-disable */\n// prettier-ignore`,
  },
  plugins: [
    pnpPlugin({
      async onResolve(_, resolvedPath) {
        if (resolvedPath == null || resolvedPath.includes('esbuild-scripts/index')) {
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
