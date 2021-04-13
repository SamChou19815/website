/* eslint-disable no-console */

import { createServer, request } from 'http';
import { join } from 'path';

import { serve } from 'esbuild';

import { CLIENT_ENTRY } from './constants';
import baseESBuildConfig from './esbuild-config';

import { GREEN, BLUE } from 'lib-colorful-terminal/colors';

export default async function startCommand(): Promise<void> {
  const esbuildServer = await serve(
    { servedir: 'public', port: 3456 },
    {
      ...baseESBuildConfig({}),
      entryPoints: [CLIENT_ENTRY],
      sourcemap: 'inline',
      outfile: join('public', 'app.js'),
    }
  );
  console.error(
    BLUE(`[i] ESBuild Server started on http://${esbuildServer.host}:${esbuildServer.port}.`)
  );

  // Then start a proxy server on port 3000
  const proxyServer = createServer((req, res) => {
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
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404</h1>');
        return;
      }

      // Otherwise, forward the response from esbuild to the client
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  }).listen(3000);

  console.error(BLUE('[i] Proxy Server started.'));
  console.error(`${GREEN('Serving at')} ${BLUE('http://localhost:3000')}`);

  await esbuildServer.wait;
  proxyServer.close();
}
