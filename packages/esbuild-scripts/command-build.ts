/* eslint-disable no-console */

import { dirname, join, resolve, relative } from 'path';

import { build } from 'esbuild';

import baseESBuildConfig from './esbuild/esbuild-config';
import {
  TEMP_SERVER_ENTRY_PATH,
  SSR_CSS_PATH,
  SSR_JS_PATH,
  TEMP_PATH,
  BUILD_PATH,
} from './utils/constants';
import { createEntryPointsGeneratedFiles } from './utils/entry-points';
import { copyDirectoryContent, ensureDirectory, remove, writeFile } from './utils/fs-promise';
import getGeneratedHTML, { SSRResult } from './utils/html-generator';

import { RED, GREEN, YELLOW } from 'lib-colorful-terminal/colors';

const generateBundle = async (entryPoints: readonly string[]): Promise<readonly string[]> => {
  const { outputFiles } = await build({
    ...baseESBuildConfig({ isProd: true }),
    entryPoints: entryPoints.map((it) => join(TEMP_PATH, `${it}.jsx`)),
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
      await ensureDirectory(dirname(file.path));
      await writeFile(file.path, file.contents);
    })
  );
  return outputFiles.map(({ path }) => relative(absoluteBuildDirectory, path));
};

type SSRFunction = (path: string) => SSRResult;

const getSSRFunction = async (): Promise<SSRFunction | null> => {
  await build({
    ...baseESBuildConfig({ isServer: true, isProd: true }),
    entryPoints: [TEMP_SERVER_ENTRY_PATH],
    platform: 'node',
    format: 'cjs',
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
};

const buildCommand = async (staticSiteGeneration: boolean): Promise<boolean> => {
  const startTime = new Date().getTime();
  console.error(YELLOW('[i] Bundling...'));
  const entryPoints = await createEntryPointsGeneratedFiles();
  await copyDirectoryContent('public', 'build');

  let outputFiles: readonly string[];
  let ssrFunction: SSRFunction | null;
  if (staticSiteGeneration) {
    [outputFiles, ssrFunction] = await Promise.all([generateBundle(entryPoints), getSSRFunction()]);
    if (ssrFunction == null) return false;
  } else {
    outputFiles = await generateBundle(entryPoints);
    ssrFunction = null;
  }
  const generatedHTMLs = entryPoints.map((entryPoint) => {
    const relevantOutputFiles = outputFiles.filter(
      (it) => it.startsWith('chunk') || it.startsWith(entryPoint)
    );
    const html = getGeneratedHTML(ssrFunction?.(entryPoint), relevantOutputFiles, true);
    return { entryPoint, html };
  });
  await Promise.all(
    generatedHTMLs.map(async ({ entryPoint, html }) => {
      let path: string;
      if (entryPoint.endsWith('index')) {
        path = join(BUILD_PATH, `${entryPoint}.html`);
      } else {
        path = join(BUILD_PATH, entryPoint, 'index.html');
      }
      await ensureDirectory(dirname(path));
      await writeFile(path, html);
    })
  );

  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ ${GREEN(`Build success in ${totalTime}ms.`)}`);
  return true;
};

export default buildCommand;
