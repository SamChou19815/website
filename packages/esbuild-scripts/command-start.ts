/* eslint-disable no-console */

import { relative } from 'path';

import { build, BuildOptions, BuildResult } from 'esbuild';
import express from 'express';

import baseESBuildConfig from './esbuild/esbuild-config';
import type { VirtualPathMappings } from './esbuild/esbuild-plugins';
import { OUT_PATH } from './utils/constants';
import {
  virtualEntryComponentsToVirtualPathMappings,
  createEntryPointsGeneratedVirtualFiles,
} from './utils/entry-points';
import getGeneratedHTML from './utils/html-generator';

class EsbuildScriptsDevServer {
  private readonly expressDevServer: express.Express = express();
  private files: readonly string[] | undefined;
  private shutdownHandlers: (() => void)[] = [];

  constructor(
    private readonly allEntryPointsWithoutExtension: readonly string[],
    esbuildBuildOptions: BuildOptions
  ) {
    this.expressDevServer.use(express.static(OUT_PATH));
    this.expressDevServer.use(express.static('public'));

    build({
      ...esbuildBuildOptions,
      // Code Splitting Configs
      assetNames: 'assets/[name]-[hash]',
      chunkNames: 'chunks/[name]-[hash]',
      entryNames: '[dir]/[name]-[hash]',
      splitting: true,
      format: 'esm',
      // Watch config for devserver serving purposes.
      outdir: OUT_PATH,
      metafile: true,
      watch: {
        onRebuild: (rebuildFailure, rebuildResult) => {
          if (rebuildResult != null) this.handleBuildResult(rebuildResult);
          if (rebuildFailure != null) console.error('[x] Rebuild Failed.');
        },
      },
    }).then((initialRebuildResult) => {
      this.shutdownHandlers.push(() => initialRebuildResult.stop?.());
      this.handleBuildResult(initialRebuildResult);
    });

    this.expressDevServer.get('*', async (request, response, next) => {
      const files = this.files;
      if (files == null) {
        return response.status(404).send('Unknown build status. Check again later.');
      }
      const entryPoint = this.getEntryPoint(request.path);
      if (entryPoint == null) return next();
      return response.send(getGeneratedHTML(undefined, files));
    });
    const startedExpressServer = this.expressDevServer.listen(3000, () =>
      console.error('Serving at http://localhost:3000')
    );
    this.shutdownHandlers.push(() => startedExpressServer.close());
  }

  shutdown = () => this.shutdownHandlers.forEach((runner) => runner());

  private handleBuildResult({ metafile, warnings, errors }: BuildResult): void {
    this.files =
      metafile &&
      Object.keys(metafile.outputs)
        .map((it) => relative(OUT_PATH, it))
        .filter((it) => !it.startsWith('__server__'));
    console.error(`[✓] Build finished with ${warnings.length} warnings, ${errors.length} errors.`);
  }

  private getEntryPoint(url?: string) {
    if (url == null || !url.startsWith('/')) return undefined;
    const path = url.substring(1);
    return this.allEntryPointsWithoutExtension.find((entryPoint) => {
      if (entryPoint.endsWith('index')) {
        return [entryPoint, entryPoint.substring(0, entryPoint.length - 5)].includes(path);
      }
      return entryPoint === path;
    });
  }
}

export default async function startCommand(
  virtualEntryComponents: VirtualPathMappings
): Promise<void> {
  const { entryPointsWithoutExtension, entryPointVirtualFiles } =
    await createEntryPointsGeneratedVirtualFiles(Object.keys(virtualEntryComponents));

  const allVirtualPathMappings = {
    ...entryPointVirtualFiles,
    ...virtualEntryComponentsToVirtualPathMappings(virtualEntryComponents),
  };
  const allEntryPointsWithoutExtension = [
    ...entryPointsWithoutExtension,
    ...Object.keys(virtualEntryComponents),
  ];

  const devServer = new EsbuildScriptsDevServer(allEntryPointsWithoutExtension, {
    ...baseESBuildConfig({ virtualPathMappings: allVirtualPathMappings }),
    entryPoints: Object.keys(entryPointVirtualFiles),
    minify: true,
  });
  process.on('SIGINT', devServer.shutdown);
  process.on('SIGTERM', devServer.shutdown);
}
