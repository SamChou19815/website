/** Fork and reimplementation of pnp's resolution to support browser and exports fields. */

import * as fs from 'fs';
import { join, normalize, sep } from 'path';

import type PnpApiNamespace from 'pnpapi';
import { resolve, legacy } from 'resolve.exports';

type PnpApi = typeof PnpApiNamespace;

const extensions = ['.tsx', '.ts', '.jsx', '.mjs', '.cjs', '.js', '.json'];

const isStrictRegExp = /^(\/|\.{1,2}(\/|$))/;
const isRelativeRegexp = /^\.{0,2}\//;

export const resolvePackageEntry = (
  packageJsonContent: unknown,
  entry: string,
  browser: boolean
): string | null => {
  const exportedPath = resolve(packageJsonContent, entry, { browser, require: !browser });
  if (exportedPath != null) return exportedPath;
  const legacyPath = legacy(
    packageJsonContent,
    browser ? { browser } : { browser: false, fields: ['main', 'module'] }
  );
  if (typeof legacyPath === 'string') return entry === '.' ? legacyPath : null;
  if (!legacyPath) return null;
  return (
    legacyPath[entry] ||
    legacyPath[`${entry}.js`] ||
    legacyPath[`./${entry}`] ||
    legacyPath[`./${entry}.js`] ||
    null
  );
};

const pathContains = (pathFrom: string, pathTo: string): string | null => {
  let from = normalize(pathFrom);
  const to = normalize(pathTo);

  if (from === to) return '.';
  if (!from.endsWith(sep)) from = from + sep;
  return to.startsWith(from) ? to.slice(from.length) : null;
};

/**
 * Forked from Yarn:
 * https://github.com/yarnpkg/berry/blob/30e1d3c52f895721aefd55dea8f21b75bdf3d4ff/packages/yarnpkg-pnp/sources/loader/makeApi.ts#L202-L245
 */
const applyNodeExportsResolution = (unqualifiedPath: string, pnpApi: PnpApi, browser: boolean) => {
  const locator = pnpApi.findPackageLocator(join(unqualifiedPath, 'internal.js'));
  if (locator == null) throw new Error();
  const { packageLocation } = pnpApi.getPackageInformation(locator);
  const manifestPath = join(packageLocation, 'package.json');
  if (!fs.existsSync(manifestPath)) return null;

  const pkgJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let subpath = pathContains(packageLocation, unqualifiedPath);
  if (subpath == null) throw new Error();
  if (!isRelativeRegexp.test(subpath)) subpath = `./${subpath}`;
  subpath = normalize(subpath);
  const remappedSubpath = resolvePackageEntry(pkgJson, subpath, browser);
  return remappedSubpath != null ? join(packageLocation, remappedSubpath) : null;
};

/**
 * Copied from Yarn:
 * https://github.com/yarnpkg/berry/blob/30e1d3c52f895721aefd55dea8f21b75bdf3d4ff/packages/yarnpkg-pnp/sources/loader/makeApi.ts#L781-L791
 */
const resolveUnqualifiedExport = (
  request: string,
  unqualifiedPath: string,
  pnpApi: PnpApi,
  browser: boolean
): string => {
  if (isStrictRegExp.test(request)) {
    return unqualifiedPath;
  }

  const unqualifiedExportPath = applyNodeExportsResolution(unqualifiedPath, pnpApi, browser);
  if (unqualifiedExportPath) {
    return normalize(unqualifiedExportPath);
  } else {
    return unqualifiedPath;
  }
};

const resolveRequest = (
  request: string,
  issuer: string,
  pnpApi: PnpApi,
  browser: boolean
): string | null => {
  const unqualifiedPath = pnpApi.resolveToUnqualified(request, issuer);
  if (unqualifiedPath == null) return null;

  return pnpApi.resolveUnqualified(
    resolveUnqualifiedExport(request, unqualifiedPath, pnpApi, browser),
    { extensions }
  );
};

export default resolveRequest;
