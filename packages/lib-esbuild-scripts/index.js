#!/usr/bin/env node

// @ts-check
/* eslint-disable no-console */

const { createHash } = require('crypto');
const { join, resolve } = require('path');

const { build, serve } = require('esbuild');
const pnpPlugin = require('esbuild-plugin-pnp');
const { copy, mkdir, readFile, remove, writeFile } = require('fs-extra');

const CLIENT_ENTRY = join('build', 'client.js');
const SERVER_ENTRY = join('build', 'server.js');
const SSR_JS_PATH = join('build', 'ssr.js');
const SSR_CSS_PATH = join('build', 'ssr.css');
const BUILD_HTML_PATH = join('build', 'index.html');
const BUILD_APP_JS_PATH = join('build', 'app.js');
const BUILD_APP_CSS_PATH = join('build', 'app.css');

/**
 * @param {boolean} isServer
 * @param {boolean} isProd
 * @returns {import('esbuild').BuildOptions}
 */
const getCommonESBuildConfig = (isServer, isProd) => ({
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

const coloredTerminalSection = (/** @type {number} */ colorID) => (/** @type {string} */ content) =>
  process.stderr.isTTY ? `\u001b[${colorID}m${content}\u001b[0m` : content;

const redTerminalSection = coloredTerminalSection(31);
const greenTerminalSection = coloredTerminalSection(32);
const blueTerminalSection = coloredTerminalSection(34);

const md5 = (/** @type {string} */ data) =>
  createHash('md5').update(data).digest().toString('hex').substring(0, 8);

async function copyTemplate() {
  await mkdir('build', { recursive: true });
  await Promise.all([
    copy(join(__dirname, 'client.js'), CLIENT_ENTRY),
    copy(join(__dirname, 'server.js'), SERVER_ENTRY),
  ]);
}

async function attachSSRResult(/** @type {string} */ rootHTML) {
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

async function runner(/** @type {string} */ command) {
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
      console.error(greenTerminalSection('Server started.'));
      console.error(`Serving at ${blueTerminalSection(`http://${server.host}:${server.port}`)}`);
      await server.wait;
      return true;
    }

    case 'build': {
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

      // eslint-disable-next-line import/no-dynamic-require
      const rootHTML = require(resolve(SSR_JS_PATH));
      await Promise.all([
        remove(CLIENT_ENTRY),
        remove(SERVER_ENTRY),
        remove(SSR_JS_PATH),
        remove(SSR_CSS_PATH),
      ]);
      await copy('public', 'build');
      await attachSSRResult(rootHTML);
      console.error(greenTerminalSection('Build success.'));
      return true;
    }

    default:
      console.error(redTerminalSection(`Unknown command: '${command || '<empty>'}'`));
      return false;
  }
}

async function main() {
  try {
    if (!(await runner(process.argv[2]))) process.exit(1);
  } catch (error) {
    console.error(redTerminalSection(error));
    process.exit(1);
  }
}

main();
