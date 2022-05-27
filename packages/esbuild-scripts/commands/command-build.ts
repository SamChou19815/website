/* eslint-disable no-console */

import { build } from 'esbuild';
import * as fs from 'fs/promises';
import { dirname, join, relative, resolve } from 'path';
import {
  BUILD_PATH,
  SSR_CSS_PATH,
  SSR_JS_PATH,
  VIRTUAL_SERVER_ENTRY_PATH,
} from '../utils/constants';
import { createEntryPointsGeneratedVirtualFiles } from '../utils/entry-points';
import type { VirtualPathMappings } from '../utils/esbuild-config';
import baseESBuildConfig from '../utils/esbuild-config';
import { copyDirectoryContent } from '../utils/fs';
import getGeneratedHTML, { SSRResult } from '../utils/html-generator';

async function generateBundle(
  entryPointVirtualFiles: VirtualPathMappings
): Promise<readonly string[]> {
  const { outputFiles } = await build({
    ...baseESBuildConfig({ virtualPathMappings: entryPointVirtualFiles, isProd: true }),
    entryPoints: Object.keys(entryPointVirtualFiles),
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
      await fs.mkdir(dirname(file.path), { recursive: true });
      await fs.writeFile(file.path, file.contents);
    })
  );
  return outputFiles.map(({ path }) => relative(absoluteBuildDirectory, path));
}

type SSRFunction = (path: string) => SSRResult;

async function getSSRFunction(
  entryPointVirtualFiles: VirtualPathMappings
): Promise<SSRFunction | null> {
  await build({
    ...baseESBuildConfig({
      virtualPathMappings: entryPointVirtualFiles,
      isServer: true,
      isProd: false,
    }),
    entryPoints: [VIRTUAL_SERVER_ENTRY_PATH],
    platform: 'node',
    format: 'cjs',
    legalComments: 'none',
    outfile: SSR_JS_PATH,
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(resolve(SSR_JS_PATH));
  } catch (error) {
    console.error(
      'Unable to perform server side rendering since the server bundle is not correctly generated.'
    );
    console.error(error);
    return null;
  } finally {
    await fs.unlink(SSR_CSS_PATH);
  }
}

export default async function buildCommand(staticSiteGeneration: boolean): Promise<boolean> {
  const startTime = new Date().getTime();
  const { entryPointsWithoutExtension, entryPointVirtualFiles } =
    await createEntryPointsGeneratedVirtualFiles();
  await copyDirectoryContent('public', 'build');

  let outputFiles: readonly string[];
  let ssrFunction: SSRFunction | null;
  if (staticSiteGeneration) {
    [outputFiles, ssrFunction] = await Promise.all([
      generateBundle(entryPointVirtualFiles),
      getSSRFunction(entryPointVirtualFiles),
    ]);
    if (ssrFunction == null) return false;
  } else {
    outputFiles = await generateBundle(entryPointVirtualFiles);
    ssrFunction = null;
  }
  const generatedHTMLs = entryPointsWithoutExtension.map((entryPoint) => {
    const html = getGeneratedHTML(ssrFunction?.(entryPoint), entryPoint, outputFiles);
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
      await fs.mkdir(dirname(path), { recursive: true });
      await fs.writeFile(path, html);
    })
  );

  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ Build success in ${totalTime}ms.`);
  return true;
}
