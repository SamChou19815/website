/* eslint-disable no-console */

import { resolve } from 'path';

import { build } from 'esbuild';
import { copy, emptyDir, readFile, remove, stat, writeFile } from 'fs-extra';

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
import htmlWithElementsAttached from './html-rewriter';

import { RED, GREEN, BLUE } from 'lib-colorful-terminal/colors';
import startSpinnerProgress from 'lib-colorful-terminal/progress';

async function generateBundle() {
  await build({
    ...baseESBuildConfig({ isProd: true }),
    entryPoints: [CLIENT_ENTRY],
    minify: true,
    outfile: BUILD_APP_JS_PATH,
  });
  return Promise.all([stat(BUILD_APP_JS_PATH), stat(BUILD_APP_CSS_PATH)]);
}

async function performSSR(): Promise<boolean> {
  await build({
    ...baseESBuildConfig({ isServer: true, isProd: true }),
    entryPoints: [SERVER_ENTRY],
    platform: 'node',
    format: 'cjs',
    outfile: SSR_JS_PATH,
  });
  let rootHTML: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-dynamic-require
    rootHTML = require(resolve(SSR_JS_PATH));
  } catch {
    console.error(
      RED(
        'Unable to perform server side rendering since the server bundle is not correctly generated.'
      )
    );
    return false;
  } finally {
    await Promise.all([remove(SSR_JS_PATH), remove(SSR_CSS_PATH)]);
  }

  const [htmlFile, jsFile, cssFile] = await Promise.all([
    readFile(BUILD_HTML_PATH),
    readFile(BUILD_APP_JS_PATH),
    readFile(BUILD_APP_CSS_PATH),
  ]);

  const finalHTML = htmlWithElementsAttached(
    htmlFile.toString(),
    rootHTML,
    { type: 'js', originalFilename: 'app.js', content: jsFile.toString() },
    { type: 'css', originalFilename: 'app.css', content: cssFile.toString() }
  );

  await writeFile(BUILD_HTML_PATH, finalHTML);
  return true;
}

export default async function buildCommand(): Promise<boolean> {
  await emptyDir('build');
  await copy('public', 'build');
  const bundlingProgressInterval = startSpinnerProgress(() => `[i] Bundling...`);
  const startTime = new Date().getTime();
  const [[jsStat, cssStat], ssrSuccess] = await Promise.all([generateBundle(), performSSR()]);
  clearInterval(bundlingProgressInterval);
  if (!ssrSuccess) return false;

  const totalTime = new Date().getTime() - startTime;
  console.error(GREEN(`Build success in ${totalTime}ms.`));
  console.error(BLUE(`Minified JS Size: ${Math.ceil(jsStat.size / 1024)}k.`));
  console.error(BLUE(`Minified CSS Size: ${Math.ceil(cssStat.size / 1024)}k.`));
  return true;
}
