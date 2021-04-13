/* eslint-disable no-console */

import { createHash } from 'crypto';
import { join, resolve } from 'path';

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import { build, BuildOptions, serve } from 'esbuild';
import { copy, mkdir, readFile, remove, stat, writeFile } from 'fs-extra';

import { RED, GREEN, BLUE } from 'lib-colorful-terminal/colors';
import startSpinnerProgress from 'lib-colorful-terminal/progress';

const CLIENT_ENTRY = join('build', 'client.js');
const SERVER_ENTRY = join('build', 'server.js');
const SSR_JS_PATH = join('build', 'ssr.js');
const SSR_CSS_PATH = join('build', 'ssr.css');
const BUILD_HTML_PATH = join('build', 'index.html');
const BUILD_APP_JS_PATH = join('build', 'app.js');
const BUILD_APP_CSS_PATH = join('build', 'app.css');

const getCommonESBuildConfig = (isServer: boolean, isProd: boolean): BuildOptions => ({
  define: {
    __SERVER__: String(isServer),
    'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
  },
  bundle: true,
  minify: false,
  target: 'es2017',
  logLevel: 'error',
  plugins: [pnpPlugin()],
});

const md5 = (data: string) =>
  createHash('md5').update(data).digest().toString('hex').substring(0, 8);

async function copyTemplate() {
  await mkdir('build', { recursive: true });
  await Promise.all([
    copy(join(__dirname, 'client.js'), CLIENT_ENTRY),
    copy(join(__dirname, 'server.js'), SERVER_ENTRY),
  ]);
}

async function attachSSRResult(rootHTML: string) {
  const [htmlFile, jsFile, cssFile] = await Promise.all([
    readFile(BUILD_HTML_PATH),
    readFile(BUILD_APP_JS_PATH),
    readFile(BUILD_APP_CSS_PATH),
  ]);
  const htmlContent = htmlFile.toString();
  const jsHash = md5(jsFile.toString());
  const cssHash = md5(cssFile.toString());

  const finalHTML = htmlContent
    .replace('href="/app.css"', `href="/app.css?h=${cssHash}"`)
    .replace('"/app.js"', `"/app.js?h=${jsHash}"`)
    .replace('"/app.js"', `"/app.js?h=${jsHash}"`)
    .replace('<div id="root"></div>', `<div id="root">${rootHTML}</div>`);

  await writeFile(BUILD_HTML_PATH, finalHTML);
}

async function runner(command: string) {
  switch (command) {
    case 'start': {
      await copyTemplate();
      const server = await serve(
        { servedir: 'public', host: '127.0.0.1', port: 3000 },
        {
          ...getCommonESBuildConfig(false, false),
          entryPoints: [CLIENT_ENTRY],
          outfile: join('public', 'app.js'),
        }
      );
      console.error(GREEN('Server started.'));
      console.error(`Serving at ${BLUE(`http://${server.host}:${server.port}`)}`);
      await server.wait;
      return true;
    }

    case 'build': {
      const bundlingProgressInterval = startSpinnerProgress(() => `[i] Bundling...`);
      const startTime = new Date().getTime();
      await copyTemplate();
      await Promise.all([
        build({
          ...getCommonESBuildConfig(false, true),
          entryPoints: [CLIENT_ENTRY],
          minify: true,
          outfile: BUILD_APP_JS_PATH,
        }),
        build({
          ...getCommonESBuildConfig(true, true),
          entryPoints: [SERVER_ENTRY],
          platform: 'node',
          format: 'cjs',
          outfile: SSR_JS_PATH,
        }),
      ]);
      clearInterval(bundlingProgressInterval);

      let rootHTML: string;
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-dynamic-require
        rootHTML = require(resolve(SSR_JS_PATH));
      } catch {
        console.error(
          RED(
            'Unable to perform server side rendering since the server bundle is not correctly generated.'
          )
        );
        rootHTML = '';
        return false;
      } finally {
        await Promise.all([
          remove(CLIENT_ENTRY),
          remove(SERVER_ENTRY),
          remove(SSR_JS_PATH),
          remove(SSR_CSS_PATH),
        ]);
      }

      await copy('public', 'build');
      const [, jsStat, cssStat] = await Promise.all([
        attachSSRResult(rootHTML),
        stat(BUILD_APP_JS_PATH),
        stat(BUILD_APP_CSS_PATH),
      ]);
      const totalTime = new Date().getTime() - startTime;
      console.error(GREEN(`Build success in ${totalTime}ms.`));
      console.error(BLUE(`Minified JS Size: ${Math.ceil(jsStat.size / 1024)}k.`));
      console.error(BLUE(`Minified CSS Size: ${Math.ceil(cssStat.size / 1024)}k.`));
      return true;
    }

    default:
      console.error(RED(`Unknown command: '${command}'`));
      return false;
  }
}

async function main() {
  try {
    if (!(await runner(process.argv[2] || ''))) process.exit(1);
  } catch (error) {
    console.error(RED(error));
    process.exit(1);
  }
}

main();
