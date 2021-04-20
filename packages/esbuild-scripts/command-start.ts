import { createServer, request } from 'http';
import { join } from 'path';

import { serve } from 'esbuild';

import baseESBuildConfig from './esbuild/esbuild-config';
import { TEMP_PATH } from './utils/constants';
import { createEntryPointsGeneratedFiles } from './utils/entry-points';
import getGeneratedHTML from './utils/html-generator';

import { GREEN, BLUE } from 'lib-colorful-terminal/colors';

const getEntryPoint = (entryPoints: readonly string[], url?: string) => {
  if (url == null || !url.startsWith('/')) return undefined;
  const path = url.substring(1);
  return entryPoints.find((entryPoint) => {
    if (entryPoint.endsWith('index')) {
      return [entryPoint, entryPoint.substring(0, entryPoint.length - 5)].includes(path);
    }
    return entryPoint === path;
  });
};

const getHTML = (entryPoint: string) =>
  getGeneratedHTML(undefined, [`${entryPoint}.js`, `${entryPoint}.css`], { esModule: false });

const startCommand = async (): Promise<void> => {
  const entryPoints = await createEntryPointsGeneratedFiles();

  const esbuildServer = await serve(
    { servedir: 'public', port: 19815 },
    {
      ...baseESBuildConfig({}),
      entryPoints: entryPoints.map((it) => join(TEMP_PATH, `${it}.jsx`)),
      sourcemap: 'inline',
      outdir: 'public',
    }
  );

  // Then start a proxy server on port 3000
  const proxyServer = createServer((req, res) => {
    const relatedEntryPoint = getEntryPoint(entryPoints, req.url);
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
  console.error(`${GREEN('Serving at')} ${BLUE('http://localhost:3000')}`);

  await esbuildServer.wait;
  proxyServer.close();
};

export default startCommand;
