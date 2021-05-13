/* eslint-disable no-console */
// @ts-check

const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const { build } = require('esbuild');

build({
  entryPoints: ['api.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'es2019',
  format: 'cjs',
  outfile: 'api.js',
  banner: {
    // Wrapping the cjs module with another iife,
    // so that // prettier-ignore can be applied to the entire file.
    js: `// @${'generated'}
/* eslint-disable */
// prettier-ignore
(() => {`,
  },
  footer: { js: '})();\n' },
  plugins: [
    pnpPlugin({
      async onResolve(_, resolvedPath) {
        if (
          resolvedPath == null ||
          resolvedPath.includes('esbuild-npm') ||
          resolvedPath.includes('remark-slug-npm') ||
          resolvedPath.includes('sass-npm') ||
          resolvedPath.includes('mdx-js')
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
