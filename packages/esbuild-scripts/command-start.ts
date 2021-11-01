import { createServer, request } from 'http';

import { serve } from 'esbuild';

import baseESBuildConfig from './esbuild/esbuild-config';
import type { VirtualPathMappings } from './esbuild/esbuild-virtual-path-plugin';
import {
  virtualEntryComponentsToVirtualPathMappings,
  createEntryPointsGeneratedVirtualFiles,
} from './utils/entry-points';
import getGeneratedHTML from './utils/html-generator';

function getEntryPoint(entryPoints: readonly string[], url?: string) {
  if (url == null || !url.startsWith('/')) return undefined;
  const path = url.substring(1);
  return entryPoints.find((entryPoint) => {
    if (entryPoint.endsWith('index')) {
      return [entryPoint, entryPoint.substring(0, entryPoint.length - 5)].includes(path);
    }
    return entryPoint === path;
  });
}

const getHTML = (entryPoint: string) =>
  getGeneratedHTML(undefined, [`${entryPoint}.js`, `${entryPoint}.css`], false);

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
  const esbuildServer = await serve(
    { servedir: 'public', port: 19815 },
    {
      ...baseESBuildConfig({ virtualPathMappings: allVirtualPathMappings }),
      entryPoints: Object.keys(entryPointVirtualFiles),
      sourcemap: 'inline',
      outdir: 'public',
    }
  );

  // Then start a proxy server on port 3000
  const proxyServer = createServer((req, res) => {
    const relatedEntryPoint = getEntryPoint(allEntryPointsWithoutExtension, req.url);
    if (relatedEntryPoint != null) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getHTML(relatedEntryPoint));
      return;
    }

    const options = {
      hostname: esbuildServer.host,
      port: esbuildServer.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // Forward each incoming request to esbuild
    const proxyReq = request(options, (proxyRes) => {
      // If esbuild returns "not found", send a custom 404 page
      if (proxyRes.statusCode === 404) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(getHTML('index'));
        return;
      }

      // Otherwise, forward the response from esbuild to the client
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  }).listen(3000);

  // eslint-disable-next-line no-console
  console.error('Serving at http://localhost:3000');

  await esbuildServer.wait;
  proxyServer.close();
}
