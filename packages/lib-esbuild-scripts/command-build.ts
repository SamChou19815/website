/* eslint-disable no-console */

import { resolve } from 'path';

import { build } from 'esbuild';
import { copy, emptyDir, ensureDir, readFile, remove, writeFile } from 'fs-extra';

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

import { RED, GREEN, YELLOW } from 'lib-colorful-terminal/colors';

async function generateBundle() {
  await build({
    ...baseESBuildConfig({ isProd: true }),
    entryPoints: [CLIENT_ENTRY],
    minify: true,
    outfile: BUILD_APP_JS_PATH,
  });
}

async function performSSR(): Promise<string | null> {
  await build({
    ...baseESBuildConfig({ isServer: true, isProd: true }),
    entryPoints: [SERVER_ENTRY],
    platform: 'node',
    format: 'cjs',
    logLevel: 'error',
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

async function attachResults(rootHTML: string) {
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
}

export default async function buildCommand(): Promise<boolean> {
  console.error(YELLOW('[i] Bundling...'));
  await ensureDir('build');
  await emptyDir('build');
  await copy('public', 'build');
  const startTime = new Date().getTime();
  const [, rootHTML] = await Promise.all([generateBundle(), performSSR()]);
  if (rootHTML == null) return false;

  await attachResults(rootHTML);
  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ ${GREEN(`Build success in ${totalTime}ms.`)}`);
  return true;
}
