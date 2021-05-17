import { createRequire } from 'module';
import { dirname, join, relative, resolve } from 'path';

import { Result as SassResult, render } from 'sass';

import { DOCS_PATH, PAGES_PATH, GENERATED_PAGES_PATH } from '../utils/constants';
import { exists, readFile } from '../utils/fs';
import compileMarkdownToReact from '../utils/mdx';
import pnpPlugin from './esbuild-pnp-plugin';
import virtualPathResolvePlugin, { VirtualPathMappings } from './esbuild-virtual-path-plugin';

import type { Plugin } from 'esbuild';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /^data:/ }, () => ({ external: true }));

    buildConfig.onResolve({ filter: /^esbuild-scripts-internal\/docs\// }, (args) => ({
      path: resolve(join(DOCS_PATH, relative(join('esbuild-scripts-internal', 'docs'), args.path))),
    }));

    buildConfig.onResolve({ filter: /^esbuild-scripts-internal\/page\// }, async (args) => {
      const relativePath = relative(join('esbuild-scripts-internal', 'page'), args.path);
      const candidates = [
        join(PAGES_PATH, `${relativePath}.js`),
        join(PAGES_PATH, `${relativePath}.jsx`),
        join(PAGES_PATH, `${relativePath}.ts`),
        join(PAGES_PATH, `${relativePath}.tsx`),
        join(GENERATED_PAGES_PATH, `${relativePath}.js`),
        join(GENERATED_PAGES_PATH, `${relativePath}.jsx`),
        join(GENERATED_PAGES_PATH, `${relativePath}.ts`),
        join(GENERATED_PAGES_PATH, `${relativePath}.tsx`),
      ];
      for (const candidate of candidates) {
        // eslint-disable-next-line no-await-in-loop
        if (await exists(candidate)) {
          return { path: resolve(candidate) };
        }
      }
      throw new Error(
        `Cannot found page at ${relativePath}. Candidates considered:\n${candidates.join('\n')}`
      );
    });
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
