/* eslint-disable no-console */

import { createHash } from 'crypto';
import { resolve } from 'path';

import { build } from 'esbuild';
import { copy, readFile, remove, stat, writeFile } from 'fs-extra';

import {
  BUILD_APP_JS_PATH,
  BUILD_APP_CSS_PATH,
  BUILD_HTML_PATH,
  CLIENT_ENTRY,
  SERVER_ENTRY,
  SSR_CSS_PATH,
  SSR_JS_PATH,
} from './constants';
import baseESBuildConfig from './esbuild-config';

import { RED, GREEN, BLUE } from 'lib-colorful-terminal/colors';
import startSpinnerProgress from 'lib-colorful-terminal/progress';

async function attachSSRResult(rootHTML: string) {
  const [htmlFile, jsFile, cssFile] = await Promise.all([
    readFile(BUILD_HTML_PATH),
    readFile(BUILD_APP_JS_PATH),
    readFile(BUILD_APP_CSS_PATH),
  ]);
  const htmlContent = htmlFile.toString();
  const md5 = (data: Buffer) =>
    createHash('md5').update(data).digest().toString('hex').substring(0, 8);
  const jsHash = md5(jsFile);
  const cssHash = md5(cssFile);

  const finalHTML = htmlContent
    .replace('href="/app.css"', `href="/app.css?h=${cssHash}"`)
    .replace('"/app.js"', `"/app.js?h=${jsHash}"`)
    .replace('"/app.js"', `"/app.js?h=${jsHash}"`)
    .replace('<div id="root"></div>', `<div id="root">${rootHTML}</div>`);

  await writeFile(BUILD_HTML_PATH, finalHTML);
}

async function performSSR(): Promise<string | null> {
  await build({
    ...baseESBuildConfig({ isServer: true, isProd: true }),
    entryPoints: [SERVER_ENTRY],
    platform: 'node',
    format: 'cjs',
    outfile: SSR_JS_PATH,
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-dynamic-require
    return require(resolve(SSR_JS_PATH));
  } catch {
    console.error(
      RED(
        'Unable to perform server side rendering since the server bundle is not correctly generated.'
      )
    );
    return null;
  } finally {
    await Promise.all([remove(SSR_JS_PATH), remove(SSR_CSS_PATH)]);
  }
}

export default async function buildCommand(): Promise<boolean> {
  const bundlingProgressInterval = startSpinnerProgress(() => `[i] Bundling...`);
  const startTime = new Date().getTime();
  const [, rootHTML] = await Promise.all([
    build({
      ...baseESBuildConfig({ isProd: true }),
      entryPoints: [CLIENT_ENTRY],
      minify: true,
      outfile: BUILD_APP_JS_PATH,
    }),
    performSSR(),
  ]);
  clearInterval(bundlingProgressInterval);
  if (rootHTML == null) return false;

  await copy('public', 'build');
  const [, jsStat, cssStat] = await Promise.all([
    attachSSRResult(rootHTML),
    stat(BUILD_APP_JS_PATH),
    stat(BUILD_APP_CSS_PATH),
  ]);
  const totalTime = new Date().getTime() - startTime;
  console.error(GREEN(`Build success in ${totalTime}ms.`));
  console.error(BLUE(`Minified JS Size: ${Math.ceil(jsStat.size / 1024)}k.`));
  console.error(BLUE(`Minified CSS Size: ${Math.ceil(cssStat.size / 1024)}k.`));
  return true;
}
