/* eslint-disable no-console */

import buildCommand from './command-build';
import initCommand from './command-init';
import startCommand from './command-start';

import { RED, BLUE } from 'lib-colorful-terminal/colors';

function help() {
  console.error(BLUE('Usage:'));
  console.error('- esbuild-script start: start the devserver.');
  console.error('- esbuild-script build: generate production build.');
  console.error('- esbuild-script ssg: generate static site.');
  console.error('- esbuild-script ssg --no-js: generate static site without JS.');
  console.error('- esbuild-script help: display command line usages.');
}

async function runner() {
  const command = process.argv[2] || '';
  switch (command) {
    case 'init':
      await initCommand();
      return true;
    case 'start':
      await startCommand();
      return true;
    case 'ssg':
      return buildCommand({ staticSiteGeneration: true, noJS: process.argv.includes('--no-js') });
    case 'build':
      return buildCommand({ staticSiteGeneration: false, noJS: false });
    case 'help':
    case '--help':
      help();
      return true;
    default:
      console.error(RED(`Unknown command: '${command}'`));
      help();
      return false;
  }
}

async function main() {
  try {
    if (!(await runner())) process.exitCode = 1;
  } catch (error) {
    console.error(RED(error));
    process.exitCode = 1;
  }
}

main();
