/* eslint-disable no-console */

import { dirname, resolve, relative } from 'path';

import { build } from 'esbuild';
import { copy, emptyDir, ensureDir, readFile, remove, writeFile } from 'fs-extra';

import {
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
  const { outputFiles } = await build({
    ...baseESBuildConfig({ isProd: true }),
    entryPoints: [CLIENT_ENTRY],
    assetNames: 'assets/[name]-[hash]',
    chunkNames: 'chunks/[name]-[hash]',
    entryNames: '[dir]/[name]-[hash]',
    minify: true,
    format: 'esm',
    splitting: true,
    write: false,
    outdir: 'build',
  });
  const absoluteBuildDirectory = resolve('build');
  await Promise.all(
    outputFiles.map(async (file) => {
      await ensureDir(dirname(file.path));
      await writeFile(file.path, file.contents, {});
    })
  );
  return outputFiles.map(({ path }) => relative(absoluteBuildDirectory, path));
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
  } catch (error) {
    console.error(
      RED(
        'Unable to perform server side rendering since the server bundle is not correctly generated.'
      )
    );
    console.error(RED(error));
    return null;
  } finally {
    await Promise.all([remove(SSR_JS_PATH), remove(SSR_CSS_PATH)]);
  }
}

async function attachResults(rootHTML: string | null, files: readonly string[], noJS: boolean) {
  const htmlFile = await readFile(BUILD_HTML_PATH);
  const finalHTML = htmlWithElementsAttached(htmlFile.toString(), rootHTML, files, {
    esModule: true,
    noJS,
  });
  await writeFile(BUILD_HTML_PATH, finalHTML);
}

export default async function buildCommand({
  staticSiteGeneration,
  noJS,
}: Readonly<{ staticSiteGeneration: boolean; noJS: boolean }>): Promise<boolean> {
  const startTime = new Date().getTime();
  console.error(YELLOW('[i] Bundling...'));
  await ensureDir('build');
  await emptyDir('build');
  await copy('public', 'build');
  if (staticSiteGeneration) {
    const [outputFiles, rootHTML] = await Promise.all([generateBundle(), performSSR()]);
    if (rootHTML == null) return false;
    await attachResults(rootHTML, outputFiles, noJS);
  } else {
    const outputFiles = await generateBundle();
    await attachResults(null, outputFiles, noJS);
  }

  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ ${GREEN(`Build success in ${totalTime}ms.`)}`);
  return true;
}
