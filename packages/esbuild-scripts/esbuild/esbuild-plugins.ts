import { createRequire } from 'module';
import { dirname, resolve } from 'path';

import mdx from '@mdx-js/mdx';
import type { Plugin } from 'esbuild';
import { Result as SassResult, render } from 'sass';

import pnpPlugin from './esbuild-pnp-plugin';

import { readFile } from 'lib-fs';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /data:/ }, () => ({ external: true }));
  },
};

const sassPlugin: Plugin = {
  name: 'sass',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /.\.(scss|sass)$/ }, async (args) => {
      if (args.path.startsWith('.')) return { path: resolve(dirname(args.importer), args.path) };
      return { path: createRequire(args.importer).resolve(args.path) };
    });

    buildConfig.onLoad({ filter: /.\.(scss|sass)$/ }, async (args) => {
      const { css } = await new Promise<SassResult>((promiseResolve, reject) => {
        render({ file: args.path }, (error, result) => {
          error ? reject(error) : promiseResolve(result);
        });
      });
      return { contents: css.toString(), loader: 'css', watchFiles: [args.path] };
    });
  },
};

const mdxPlugin: Plugin = {
  name: 'mdx',
  setup(buildConfig) {
    buildConfig.onLoad({ filter: /\.mdx?$/ }, async (args) => {
      const text = await readFile(args.path);
      const contents = `import React from'react';
import mdx from'esbuild-scripts/__internal-components__/mdx';
${await mdx(text)}`;
      return { contents, loader: 'jsx' };
    });
  },
};

const esbuildPlugins: Plugin[] = [webAppResolvePlugin, sassPlugin, mdxPlugin, pnpPlugin()];

export default esbuildPlugins;
