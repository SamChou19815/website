/* eslint-disable no-console */

import { mkdir, writeFile, unlink } from 'fs/promises';
import { dirname, join, resolve, relative } from 'path';

import { build } from 'esbuild';

import baseESBuildConfig from './esbuild/esbuild-config';
import type { VirtualPathMappings } from './esbuild/esbuild-plugins';
import {
  SSR_CSS_PATH,
  SSR_JS_PATH,
  BUILD_PATH,
  VIRTUAL_SERVER_ENTRY_PATH,
} from './utils/constants';
import {
  virtualEntryComponentsToVirtualPathMappings,
  createEntryPointsGeneratedVirtualFiles,
} from './utils/entry-points';
import { copyDirectoryContent } from './utils/fs';
import getGeneratedHTML, { SSRResult } from './utils/html-generator';

async function generateBundle(
  entryPointVirtualFiles: VirtualPathMappings,
  virtualEntryComponents: VirtualPathMappings
): Promise<readonly string[]> {
  const allVirtualPathMappings = {
    ...entryPointVirtualFiles,
    ...virtualEntryComponentsToVirtualPathMappings(virtualEntryComponents),
  };
  const { outputFiles } = await build({
    ...baseESBuildConfig({ virtualPathMappings: allVirtualPathMappings, isProd: true }),
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
      await mkdir(dirname(file.path), { recursive: true });
      await writeFile(file.path, file.contents);
    })
  );
  return outputFiles.map(({ path }) => relative(absoluteBuildDirectory, path));
}

type SSRFunction = (path: string) => SSRResult;

async function getSSRFunction(
  entryPointVirtualFiles: VirtualPathMappings,
  virtualEntryComponents: VirtualPathMappings
): Promise<SSRFunction | null> {
  await build({
    ...baseESBuildConfig({
      virtualPathMappings: {
        ...entryPointVirtualFiles,
        ...virtualEntryComponentsToVirtualPathMappings(virtualEntryComponents),
      },
      isServer: true,
      isProd: true,
    }),
    entryPoints: [VIRTUAL_SERVER_ENTRY_PATH],
    platform: 'node',
    format: 'cjs',
    legalComments: 'none',
    outfile: SSR_JS_PATH,
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-dynamic-require
    return require(resolve(SSR_JS_PATH));
  } catch (error) {
    console.error(
      'Unable to perform server side rendering since the server bundle is not correctly generated.'
    );
    console.error(error);
    return null;
  } finally {
    await unlink(SSR_CSS_PATH);
  }
}

export default async function buildCommand(
  virtualEntryComponents: VirtualPathMappings,
  staticSiteGeneration: boolean
): Promise<boolean> {
  const startTime = new Date().getTime();
  const { entryPointsWithoutExtension, entryPointVirtualFiles } =
    await createEntryPointsGeneratedVirtualFiles(Object.keys(virtualEntryComponents));
  await copyDirectoryContent('public', 'build');

  let outputFiles: readonly string[];
  let ssrFunction: SSRFunction | null;
  if (staticSiteGeneration) {
    [outputFiles, ssrFunction] = await Promise.all([
      generateBundle(entryPointVirtualFiles, virtualEntryComponents),
      getSSRFunction(entryPointVirtualFiles, virtualEntryComponents),
    ]);
    if (ssrFunction == null) return false;
  } else {
    outputFiles = await generateBundle(entryPointVirtualFiles, virtualEntryComponents);
    ssrFunction = null;
  }
  const generatedHTMLs = [
    ...entryPointsWithoutExtension,
    ...Object.keys(virtualEntryComponents),
  ].map((entryPoint) => {
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
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, html);
    })
  );

  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ Build success in ${totalTime}ms.`);
  return true;
}
