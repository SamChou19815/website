import { dirname, resolve } from 'path';

import type { Plugin } from 'esbuild';
import { Result as SassResult, render } from 'sass';

import pnpPlugin from './esbuild-pnp-plugin';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /data:/ }, () => ({ external: true }));
  },
};

const sassPlugin: Plugin = {
  name: 'sass',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /.\.(scss|sass)$/ }, async (args) => ({
      path: resolve(dirname(args.importer), args.path),
    }));

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

const esbuildPlugins: Plugin[] = [webAppResolvePlugin, sassPlugin, pnpPlugin()];

export default esbuildPlugins;
