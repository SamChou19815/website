// @ts-check

const { readFile } = require('fs/promises');
const { join } = require('path');

const { build } = require('esbuild');

const filter = /()/;
const extensions = ['.tsx', '.ts', '.jsx', '.mjs', '.cjs', '.js', '.css', '.json'];

/** @type {import('esbuild').Plugin} */
const pnpPlugin = {
  name: 'esbuild-plugin-yarn-pnp-fork-handle-external',
  setup(buildOptions) {
    // @ts-expect-error: pnp api
    const { findPnpApi } = require('module');
    if (typeof findPnpApi === 'undefined') return;
    const baseDir = process.cwd();
    const externals = new Set(buildOptions.initialOptions.external || []);
    buildOptions.onResolve({ filter }, (args) => {
      // The entry point resolution uses an empty string
      const effectiveImporter = args.importer ? args.importer : `${baseDir}/`;
      // Path isn't controlled by PnP so delegate to the next resolver in the chain
      /** @type {import('pnpapi')} */
      const pnpApi = findPnpApi(effectiveImporter);
      if (!pnpApi) return undefined;

      const unqualifiedPath = pnpApi.resolveToUnqualified(args.path, effectiveImporter, {
        considerBuiltins: true,
      });
      if (unqualifiedPath == null) return { external: true };
      const packageLocator = pnpApi.findPackageLocator(join(unqualifiedPath, 'internal.js'));
      // Remove external packages
      if (packageLocator != null && externals.has(packageLocator.name)) return { external: true };

      const resolvedPath = pnpApi.resolveUnqualified(unqualifiedPath, { extensions });
      return { namespace: `pnp`, path: resolvedPath };
    });
    // We register on the build to prevent ESBuild from reading the files
    // itself, since it wouldn't know how to access the files from within
    // the zip archives.
    if (buildOptions.onLoad !== null) {
      buildOptions.onLoad({ filter }, async (args) => ({
        contents: await readFile(args.path, 'utf8'),
        loader: 'default',
      }));
    }
  },
};

/**
 * @param {string} entryPoint
 * @param {string} outFile
 * @param {string[] | undefined} externals
 * @returns {Promise<void>}
 */
const bundle = async (entryPoint, outFile, externals) =>
  build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'es2019',
    format: 'cjs',
    outfile: outFile,
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
    external: externals,
    plugins: [pnpPlugin],
  })
    .catch(() => process.exit(1))
    // eslint-disable-next-line no-console
    .then(({ warnings }) => warnings.forEach((warning) => console.error(`[!] ${warning.text}`)));

module.exports = bundle;
