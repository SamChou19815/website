/* eslint-disable no-console */

import { join } from 'path';

import { serve } from 'esbuild';

import { CLIENT_ENTRY } from './constants';
import baseESBuildConfig from './esbuild-config';

import { GREEN, BLUE } from 'lib-colorful-terminal/colors';

export default async function startCommand(): Promise<void> {
  const server = await serve(
    { servedir: 'public', host: '127.0.0.1', port: 3000 },
    {
      ...baseESBuildConfig({}),
      entryPoints: [CLIENT_ENTRY],
      sourcemap: 'inline',
      outfile: join('public', 'app.js'),
    }
  );
  console.error(GREEN('Server started.'));
  console.error(`Serving at ${BLUE(`http://${server.host}:${server.port}`)}`);
  await server.wait;
}
