import { context, type BuildOptions, type BuildResult } from "esbuild";
import express from "express";
import expressWebSocket from "express-ws";
import * as fs from "fs";
import type { Socket } from "net";
import * as path from "path";
import { OUT_PATH } from "../utils/constants";
import { createEntryPointsGeneratedVirtualFiles } from "../utils/entry-points";
import baseESBuildConfig from "../utils/esbuild-config";
import {
  postProcessMetafile,
  getGeneratedHTML,
  type DependencyGraph,
} from "../utils/html-generator";

class EsbuildScriptsDevServer {
  private readonly expressDevServer = express();
  private readonly expressWebSocket = expressWebSocket(this.expressDevServer);
  private readonly websocketServer = this.expressWebSocket.getWss();
  private dependencyGraph: DependencyGraph = {
    entryPointImportsMap: new Map(),
    chunkToEntryPointOwnerMap: new Map(),
  };
  private hasErrors = false;
  private shutdownHandlers: (() => void)[] = [];

  constructor(
    private readonly allEntryPointsWithoutExtension: readonly string[],
    esbuildBuildOptions: BuildOptions,
  ) {
    this.expressDevServer.use(express.static(OUT_PATH, { maxAge: 3600 * 1000 }));
    this.expressDevServer.use(express.static("public", { maxAge: 3600 * 1000 }));
    this.expressDevServer.use(
      express.static(path.join(__dirname, "devserver-js"), { maxAge: 3600 * 1000 }),
    );

    this.expressDevServer.get("*", async (request, response, next) => {
      const entryPoint = this.getEntryPoint(request.path);
      if (entryPoint == null) {
        return next();
      }
      const html = `${getGeneratedHTML(undefined, entryPoint, this.dependencyGraph)}
<script src="/dev-server-websocket.js"></script>
`;
      return response.send(html);
    });
    this.expressWebSocket.app.ws("/_ws", () => {});
    const startedExpressServer = this.expressDevServer.listen(3000, () =>
      console.error("[i] Serving at http://localhost:3000"),
    );

    let expressConnections: Socket[] = [];
    startedExpressServer.on("connection", (connection) => {
      expressConnections.push(connection);
      connection.on("close", () => {
        expressConnections = expressConnections.filter((curr) => curr !== connection);
      });
    });
    this.websocketServer.on("connection", (socket) =>
      socket.send(JSON.stringify({ hasErrors: this.hasErrors })),
    );

    const buildConfig: BuildOptions & { metafile: true } = {
      ...esbuildBuildOptions,
      // Code Splitting Configs
      assetNames: "assets/[name]-[hash]",
      chunkNames: "chunks/[name]-[hash]",
      entryNames: "[dir]/[name]-[hash]",
      sourcemap: "inline",
      splitting: true,
      format: "esm",
      // Watch config for devserver serving purposes.
      outdir: OUT_PATH,
      write: true,
      metafile: true,
    };
    buildConfig.plugins?.push({
      name: "on-rebuild-plugin",
      setup: (build) => {
        build.onEnd((rebuildResult) => {
          this.handleBuildResult(rebuildResult);
        });
      },
    });
    context(buildConfig)
      .then((context) => {
        context.watch();

        this.shutdownHandlers.push(() => {
          context.dispose();
          this.websocketServer.clients.forEach((it) => it.close());
          this.websocketServer.close();
          expressConnections.forEach((it) => it.destroy());
          startedExpressServer.close();
        });
      })
      .catch(() => {});
  }

  shutdown = () => {
    console.error("\n[?] Shutting down...");
    this.shutdownHandlers.forEach((runner) => runner());
    fs.rmSync(OUT_PATH, { recursive: true, force: true });
    console.error("[✓] Server down.");
  };

  private handleBuildResult({
    metafile,
    errors,
  }: BuildResult<BuildOptions & { metafile: true }>): void {
    this.dependencyGraph = postProcessMetafile(metafile, OUT_PATH);
    this.hasErrors = errors.length > 0;
    this.websocketServer.clients.forEach((socket) =>
      socket.send(
        JSON.stringify({
          hasErrors: this.hasErrors,
        }),
      ),
    );
    console.error(`[✓] Build finished with ${errors.length} errors.`);
  }

  private getEntryPoint(url: string) {
    if (!url.startsWith("/")) {
      return undefined;
    }
    const urlPath = url.substring(1);
    return this.allEntryPointsWithoutExtension.find((entryPoint) => {
      if (entryPoint.endsWith("index")) {
        return [entryPoint, entryPoint.substring(0, entryPoint.length - 5)].includes(urlPath);
      }
      return entryPoint === urlPath;
    });
  }
}

export default async function startCommand(): Promise<void> {
  const { entryPointsWithoutExtension, entryPointVirtualFiles } =
    await createEntryPointsGeneratedVirtualFiles();

  const devServer = new EsbuildScriptsDevServer(entryPointsWithoutExtension, {
    ...baseESBuildConfig({ virtualPathMappings: entryPointVirtualFiles }),
    entryPoints: Object.keys(entryPointVirtualFiles),
    minify: true,
  });
  process.on("SIGINT", devServer.shutdown);
  process.on("SIGTERM", devServer.shutdown);
  process.stdin.on("end", devServer.shutdown);
}
