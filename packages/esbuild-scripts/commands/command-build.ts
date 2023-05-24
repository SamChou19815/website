import { build, type Metafile } from "esbuild";
import * as fs from "fs/promises";
import * as path from "path";
import { BUILD_PATH, SSR_JS_PATH, VIRTUAL_SERVER_ENTRY_PATH } from "../utils/constants";
import { createEntryPointsGeneratedVirtualFiles, type SSRResult } from "../utils/entry-points";
import type { VirtualPathMappings } from "../utils/esbuild-config";
import baseESBuildConfig from "../utils/esbuild-config";
import { copyDirectoryContent } from "../utils/fs";
import { postProcessMetafile, getGeneratedHTML } from "../utils/html-generator";

async function generateBundle(entryPointVirtualFiles: VirtualPathMappings): Promise<Metafile> {
  const { outputFiles, metafile } = await build({
    ...baseESBuildConfig({ virtualPathMappings: entryPointVirtualFiles, isProd: true }),
    entryPoints: Object.keys(entryPointVirtualFiles),
    assetNames: "assets/[name]-[hash]",
    chunkNames: "chunks/[name]-[hash]",
    entryNames: "[dir]/[name]-[hash]",
    metafile: true,
    minify: true,
    format: "esm",
    splitting: true,
    write: false,
    outdir: BUILD_PATH,
  });
  await Promise.all(
    outputFiles.map(async (file) => {
      await fs.mkdir(path.dirname(file.path), { recursive: true });
      await fs.writeFile(file.path, file.contents);
    }),
  );
  await fs.writeFile(
    path.join(BUILD_PATH, "metafile.json"),
    JSON.stringify(metafile, undefined, 2) + "\n",
  );
  return metafile;
}

type SSRFunction = (_path: string) => SSRResult;

async function getSSRFunction(
  entryPointVirtualFiles: VirtualPathMappings,
): Promise<SSRFunction | null> {
  await build({
    ...baseESBuildConfig({
      virtualPathMappings: entryPointVirtualFiles,
      isServer: true,
      isProd: false,
    }),
    entryPoints: [VIRTUAL_SERVER_ENTRY_PATH],
    platform: "node",
    format: "esm",
    conditions: ["module", "browser"],
    legalComments: "none",
    outfile: SSR_JS_PATH,
  });
  try {
    return import(path.resolve(SSR_JS_PATH)).then((it) => it.default);
  } catch (error) {
    console.error(
      "Unable to perform server side rendering since the server bundle is not correctly generated.",
    );
    console.error(error);
    return null;
  }
}

export default async function buildCommand(): Promise<boolean> {
  const startTime = new Date().getTime();
  const { entryPointsWithoutExtension, entryPointVirtualFiles } =
    await createEntryPointsGeneratedVirtualFiles();
  await copyDirectoryContent("public", "build");

  const dependencyGraph = postProcessMetafile(
    await generateBundle(entryPointVirtualFiles),
    BUILD_PATH,
  );
  const ssrFunction = await getSSRFunction(entryPointVirtualFiles);
  if (ssrFunction == null) {
    return false;
  }
  const generatedHTMLs = entryPointsWithoutExtension.map((entryPoint) => {
    const html = getGeneratedHTML(ssrFunction?.(entryPoint), entryPoint, dependencyGraph);
    return { entryPoint, html };
  });
  await Promise.all(
    generatedHTMLs.map(async ({ entryPoint, html }) => {
      let htmlPath: string;
      if (entryPoint.endsWith("index")) {
        htmlPath = path.join(BUILD_PATH, `${entryPoint}.html`);
      } else {
        htmlPath = path.join(BUILD_PATH, entryPoint, "index.html");
      }
      await fs.mkdir(path.dirname(htmlPath), { recursive: true });
      await fs.writeFile(htmlPath, html);
    }),
  );

  const totalTime = new Date().getTime() - startTime;
  console.error(`⚡ Build success in ${totalTime}ms.`);
  return true;
}
