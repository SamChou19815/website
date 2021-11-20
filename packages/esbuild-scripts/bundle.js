// @ts-check

const { build } = require('esbuild');

build({
  entryPoints: ['api.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'es2019',
  format: 'cjs',
  outfile: 'api.js',
  sourcemap: true,
  banner: {
    // Wrapping the cjs module with another iife,
    // so that // prettier-ignore can be applied to the entire file.
    js: `// @${'generated'}
/* eslint-disable */
// prettier-ignore
(() => {`,
  },
  footer: { js: '})();' },
  external: ['@mdx-js/mdx', 'esbuild', 'remark-slug'],
})
  .catch(() => process.exit(1))
  // eslint-disable-next-line no-console
  .then(({ warnings }) => warnings.forEach((warning) => console.error(`[!] ${warning.text}`)));
