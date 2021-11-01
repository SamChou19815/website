// Forked from https://github.com/yarnpkg/berry/blob/master/packages/esbuild-plugin-pnp/sources/index.ts

import * as fs from 'fs';

import type { OnLoadArgs, Plugin, PluginBuild } from 'esbuild';
import type PnpApi from 'pnpapi';

import resolveRequest from './pnp-resolution';

const matchAll = /()/;

const pnpPlugin = (): Plugin => ({
  name: 'esbuild-scripts-esbuild-plugin-pnp',
  setup(build: PluginBuild) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const { findPnpApi } = require('module');
    if (typeof findPnpApi === 'undefined') return;
    const baseDir = process.cwd();

    build.onResolve({ filter: matchAll }, async (args) => {
      // The entry point resolution uses an empty string
      const effectiveImporter = args.importer ? args.importer : `${baseDir}/`;
      const pnpApi = findPnpApi(effectiveImporter) as typeof PnpApi | null;
      // Path isn't controlled by PnP so delegate to the next resolver in the chain
      if (!pnpApi) return undefined;

      const queryIndex = args.path.lastIndexOf('?');
      const pathForPnp = queryIndex === -1 ? args.path : args.path.substring(0, queryIndex);
      const pnpResolvedPath = resolveRequest(
        pathForPnp,
        effectiveImporter,
        pnpApi,
        build.initialOptions.platform !== 'node'
      );
      if (pnpResolvedPath == null) return { external: true };

      return {
        namespace: 'pnp',
        path: `${pnpResolvedPath}${queryIndex === -1 ? '' : args.path.substring(queryIndex)}`,
      };
    });

    // We register on the build to prevent ESBuild from reading the files
    // itself, since it wouldn't know how to access the files from within
    // the zip archives.
    if (build.onLoad !== null) {
      build.onLoad({ filter: matchAll }, async (args: OnLoadArgs) => ({
        contents: await fs.promises.readFile(args.path, 'utf8'),
        loader: 'default',
      }));
    }
  },
});

export default pnpPlugin;
