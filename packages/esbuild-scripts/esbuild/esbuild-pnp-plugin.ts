// Forked from https://github.com/yarnpkg/berry/blob/master/packages/esbuild-plugin-pnp/sources/index.ts

import * as fs from 'fs';
import { join } from 'path';

import type { OnLoadArgs, Plugin, PluginBuild } from 'esbuild';
import type PnpApi from 'pnpapi';

const matchAll = /()/;
const extensions = ['.tsx', '.ts', '.jsx', '.mjs', '.cjs', '.js', '.css', '.json'];

const read = async (path: string) => fs.promises.readFile(path, 'utf8');

const isRootPackagePath = (path: string) => {
  if (path.startsWith('.')) return false;
  const pathWithoutNamespace = path.startsWith('@') ? path.substring(path.indexOf('/') + 1) : path;
  return !pathWithoutNamespace.includes('/');
};

const pnpPlugin = (): Plugin => ({
  name: '@yarnpkg/esbuild-plugin-pnp',
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

      const pnpResolvedPath = pnpApi.resolveRequest(args.path, effectiveImporter, {
        considerBuiltins: true,
        extensions,
      });
      if (pnpResolvedPath == null) return { external: true };

      if (build.initialOptions.platform === 'browser' && isRootPackagePath(args.path)) {
        // Source path is a package. We want to ensure we are using the browser field.
        const packageLocator = pnpApi.findPackageLocator(pnpResolvedPath);
        if (packageLocator != null) {
          const packagePath = pnpApi.getPackageInformation(packageLocator).packageLocation;
          const { browser }: { browser?: string } = await read(
            join(packagePath, 'package.json')
          ).then((it) => JSON.parse(it));
          if (typeof browser === 'string') {
            return { namespace: 'pnp', path: join(packagePath, browser) };
          }
        }
      }
      return { namespace: 'pnp', path: pnpResolvedPath };
    });

    // We register on the build to prevent ESBuild from reading the files
    // itself, since it wouldn't know how to access the files from within
    // the zip archives.
    if (build.onLoad !== null) {
      build.onLoad({ filter: matchAll }, async (args: OnLoadArgs) => ({
        contents: await read(args.path),
        loader: 'default',
      }));
    }
  },
});

export default pnpPlugin;
