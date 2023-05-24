import type { Metafile } from "esbuild";
import { relative } from "path";
import type { HelmetServerState } from "react-helmet-async";
import { rewriteEntryPointPathForRouting, type SSRResult } from "./entry-points";

type EntryPointImports = {
  readonly hardImports: readonly string[];
  readonly lazyImports: readonly string[];
  readonly cssImports: readonly string[];
};

export type DependencyGraph = {
  /** The mapping from entry points to  */
  readonly entryPointImportsMap: ReadonlyMap<string, EntryPointImports>;
  readonly chunkToEntryPointOwnerMap: ReadonlyMap<string, string>;
};

const ROUTE_ENTRY_POINT_PREFIX =
  "virtual-path:esbuild-scripts-internal/virtual/__generated-entry-point__/";

export function postProcessMetafile(metafile: Metafile, outputPrefix: string): DependencyGraph {
  const entryPointImportsMap = new Map<string, EntryPointImports>();
  const chunkToEntryPointOwnerMap = new Map<string, string>();
  Object.entries(metafile.outputs).forEach(([filename, { imports, entryPoint, cssBundle }]) => {
    const normalizedFilename = relative(outputPrefix, filename);
    if (normalizedFilename.startsWith("__server__")) {
      return;
    }
    if (normalizedFilename.endsWith(".js")) {
      if (normalizedFilename.startsWith("chunk")) {
        if (entryPoint) {
          const normalizedEntryPoint = rewriteEntryPointPathForRouting(
            entryPoint.substring("src/pages/".length, entryPoint.length - ".jsx".length),
          );
          chunkToEntryPointOwnerMap.set(normalizedFilename, normalizedEntryPoint);
        }
      } else if (entryPoint?.startsWith(ROUTE_ENTRY_POINT_PREFIX)) {
        const hardImports: string[] = [normalizedFilename];
        const lazyImports: string[] = [];
        const cssImports: string[] = [];
        for (const { path, kind } of imports) {
          if (path.endsWith(".js")) {
            if (kind === "dynamic-import") {
              lazyImports.push(relative(outputPrefix, path));
            } else {
              hardImports.push(relative(outputPrefix, path));
            }
          }
        }
        if (cssBundle) {
          cssImports.push(relative(outputPrefix, cssBundle));
        }
        const normalizedEntryPoint = rewriteEntryPointPathForRouting(
          entryPoint.substring(ROUTE_ENTRY_POINT_PREFIX.length, entryPoint.length - ".jsx".length),
        );
        entryPointImportsMap.set(normalizedEntryPoint, { hardImports, lazyImports, cssImports });
      }
    }
  });
  return { entryPointImportsMap, chunkToEntryPointOwnerMap };
}

function getLinks(
  entryPoint: string,
  { entryPointImportsMap, chunkToEntryPointOwnerMap }: DependencyGraph,
  ssrResult: SSRResult | undefined,
) {
  const imports = entryPointImportsMap.get(entryPoint);
  if (imports == null) throw new Error(`Missing ${entryPoint}`);

  const processedLinks = ssrResult?.links
    ? Array.from(
        new Set(ssrResult.links.filter((it) => it.startsWith("/")).map((it) => it.substring(1))),
      )
    : null;
  /**
   * We will strip away all chunks that are not directly linked to this page.
   * This is based on guesses. However, if the guess is inaccurate, we only pay for performance cost.
   */
  function isRelatedToLinkedEntryPoint(lazyImportLink: string) {
    if (processedLinks) {
      const linkedEntryPoint = chunkToEntryPointOwnerMap.get(lazyImportLink);
      if (linkedEntryPoint == null) return true;
      return processedLinks.some((link) => link.startsWith(linkedEntryPoint));
    } else {
      return true;
    }
  }

  const headCSSLinks = imports.cssImports
    .map((href) => `<link rel="stylesheet" href="/${href}" />`)
    .join("");
  const headJSLinks = ssrResult?.noJS
    ? ""
    : [...imports.hardImports, ...imports.lazyImports.filter(isRelatedToLinkedEntryPoint)]
        .map((href) => `<link rel="modulepreload" href="/${href}" />`)
        .join("");
  const bodyScriptLinks = ssrResult?.noJS
    ? ""
    : imports.hardImports.map((href) => `<script type="module" src="/${href}"></script>`).join("");

  return { headLinks: headCSSLinks + headJSLinks, bodyScriptLinks };
}

function getHeadHTML(headLinks: string, helmet?: HelmetServerState) {
  if (helmet == null) {
    return `<head>${headLinks}</head>`;
  }
  const parts = [
    helmet.meta.toString(),
    helmet.title.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    headLinks,
  ];
  return `<head>${parts.join("")}</head>`;
}

export function getGeneratedHTML(
  ssrResult: SSRResult | undefined,
  entryPoint: string,
  dependencyGraph: DependencyGraph,
): string {
  const { headLinks, bodyScriptLinks } = getLinks(
    rewriteEntryPointPathForRouting(entryPoint),
    dependencyGraph,
    ssrResult,
  );
  if (ssrResult == null) {
    const head = getHeadHTML(headLinks);
    const body = `<body><div id="root"></div>${bodyScriptLinks}</body>`;
    return `<!DOCTYPE html><html>${head}${body}</html>`;
  }
  const { divHTML, helmet } = ssrResult;
  const head = getHeadHTML(headLinks, helmet);
  const body = `<body><div id="root">${divHTML}</div>${bodyScriptLinks}</body>`;
  return `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}>${head}${body}</html>`;
}
