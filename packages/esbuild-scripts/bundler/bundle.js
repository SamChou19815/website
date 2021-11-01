// @ts-check

require('./api')(
  /* entryPoint */ 'api.ts',
  /* outFile */ 'api.js',
  /* externals */ ['@mdx-js/mdx', 'esbuild', 'remark-slug', 'sass']
);
