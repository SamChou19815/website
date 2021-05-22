import { createRequire } from 'module';
import { dirname, resolve } from 'path';

import type { Plugin } from 'esbuild';
import { Result as SassResult, render } from 'sass';

import { readFile } from '../utils/fs';
import compileMarkdownToReact from '../utils/mdx';
import pnpPlugin from './esbuild-pnp-plugin';
import virtualPathResolvePlugin, { VirtualPathMappings } from './esbuild-virtual-path-plugin';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /^data:/ }, () => ({ external: true }));
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
    buildConfig.onLoad({ filter: /\.md\?truncated=true$/ }, async (args) => ({
      contents: await compileMarkdownToReact(
        await readFile(args.path.substring(0, args.path.lastIndexOf('?'))),
        true
      ),
      loader: 'jsx',
    }));
    buildConfig.onLoad({ filter: /\.md$/ }, async (args) => ({
      contents: await compileMarkdownToReact(await readFile(args.path), false),
      loader: 'jsx',
    }));
  },
};

const esbuildPlugins = (virtualPathMappings: VirtualPathMappings): Plugin[] => [
  webAppResolvePlugin,
  virtualPathResolvePlugin(virtualPathMappings),
  sassPlugin,
  mdxPlugin,
  pnpPlugin(),
];

export default esbuildPlugins;
