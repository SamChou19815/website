/* eslint-disable no-console */

import { build, BuildOptions, BuildResult } from 'esbuild';
import express from 'express';
import expressWebSocket from 'express-ws';
import * as fs from 'fs';
import type { Socket } from 'net';
import * as path from 'path';
import { OUT_PATH } from '../utils/constants';
import {
  createEntryPointsGeneratedVirtualFiles,
  virtualEntryComponentsToVirtualPathMappings,
} from '../utils/entry-points';
import type { VirtualPathMappings } from '../utils/esbuild-config';
import baseESBuildConfig from '../utils/esbuild-config';
import getGeneratedHTML from '../utils/html-generator';

function isCSSChangeOnly(oldFiles: readonly string[], newFiles: readonly string[]) {
  const oldJSKeys = oldFiles
    .filter((it) => !it.endsWith('.css'))
    .sort((a, b) => a.localeCompare(b));
  const newJSKeys = newFiles
    .filter((it) => !it.endsWith('.css'))
    .sort((a, b) => a.localeCompare(b));
  return oldJSKeys.join(',') === newJSKeys.join(',');
}

class EsbuildScriptsDevServer {
  private readonly expressDevServer = express();
  private readonly expressWebSocket = expressWebSocket(this.expressDevServer);
  private readonly websocketServer = this.expressWebSocket.getWss();
  private files: readonly string[] = [];
  private hasErrors = false;
  private shutdownHandlers: (() => void)[] = [];

  constructor(
    private readonly allEntryPointsWithoutExtension: readonly string[],
    esbuildBuildOptions: BuildOptions
  ) {
    this.expressDevServer.use(express.static(OUT_PATH, { maxAge: 3600 * 1000 }));
    this.expressDevServer.use(express.static('public', { maxAge: 3600 * 1000 }));
    this.expressDevServer.use(
      express.static(path.join(__dirname, 'devserver-js'), { maxAge: 3600 * 1000 })
    );

    this.expressDevServer.get('*', async (request, response, next) => {
      const entryPoint = this.getEntryPoint(request.path);
      if (entryPoint == null) return next();
      const html = `${getGeneratedHTML(undefined, entryPoint, this.files)}
<script src="/dev-server-websocket.js"></script>
`;
      return response.send(html);
    });
    this.expressWebSocket.app.ws('/_ws', () => {});
    const startedExpressServer = this.expressDevServer.listen(3000, () =>
      console.error('[i] Serving at http://localhost:3000')
    );

    let expressConnections: Socket[] = [];
    startedExpressServer.on('connection', (connection) => {
      expressConnections.push(connection);
      connection.on('close', () => {
        expressConnections = expressConnections.filter((curr) => curr !== connection);
      });
    });
    this.websocketServer.on('connection', () =>
      this.webSocketServerPublish({ hasErrors: this.hasErrors })
    );

    build({
      ...esbuildBuildOptions,
      // Code Splitting Configs
      assetNames: 'assets/[name]-[hash]',
      chunkNames: 'chunks/[name]-[hash]',
      entryNames: '[dir]/[name]-[hash]',
      sourcemap: 'inline',
      splitting: true,
      format: 'esm',
      // Watch config for devserver serving purposes.
      outdir: OUT_PATH,
      write: true,
      metafile: true,
      incremental: true,
      watch: {
        onRebuild: (rebuildFailure, rebuildResult) => {
          if (rebuildResult != null) this.handleBuildResult(rebuildResult);
          if (rebuildFailure != null) console.error('[x] Rebuild Failed.');
        },
      },
    })
      .then((initialRebuildResult) => {
        this.shutdownHandlers.push(() => initialRebuildResult.stop?.());
        this.handleBuildResult(initialRebuildResult);

        this.shutdownHandlers.push(() => {
          this.websocketServer.clients.forEach((it) => it.close());
          this.websocketServer.close();
          expressConnections.forEach((it) => it.destroy());
          startedExpressServer.close();
        });
      })
      .catch(() => {});
  }

  shutdown = () => {
    console.error('\n[?] Shutting down...');
    this.shutdownHandlers.forEach((runner) => runner());
    fs.rmSync(OUT_PATH, { recursive: true, force: true });
    console.error('[✓] Server down.');
  };

  private handleBuildResult({ metafile, errors }: BuildResult): void {
    const newFiles = Object.keys(metafile?.outputs ?? {}).flatMap((fullPath) => {
      const relativePath = path.relative(OUT_PATH, fullPath);
      if (relativePath.startsWith('__server__')) return [];
      if (relativePath.endsWith('.css') && relativePath.startsWith('index-')) return [relativePath];
      if (relativePath.endsWith('.js')) return [relativePath];
      return [];
    });
    const cssOnlyChange =
      isCSSChangeOnly(this.files, newFiles) && newFiles.find((it) => it.endsWith('.css'));
    this.files = newFiles;
    this.hasErrors = errors.length > 0;
    this.webSocketServerPublish({ hasErrors: this.hasErrors, cssOnlyChange });
    console.error(`[✓] Build finished with ${errors.length} errors.`);
  }

  private webSocketServerPublish(obj: unknown) {
    this.websocketServer.clients.forEach(async (socket) => socket.send(JSON.stringify(obj)));
  }

  private getEntryPoint(url: string) {
    if (!url.startsWith('/')) return undefined;
    const urlPath = url.substring(1);
    return this.allEntryPointsWithoutExtension.find((entryPoint) => {
      if (entryPoint.endsWith('index')) {
        return [entryPoint, entryPoint.substring(0, entryPoint.length - 5)].includes(urlPath);
      }
      return entryPoint === urlPath;
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
  process.stdin.on('end', devServer.shutdown);
}
