/* eslint-disable no-console */

import buildCommand from './command-build';
import startCommand from './command-start';

import { RED, BLUE } from 'lib-colorful-terminal/colors';

function help() {
  console.error(BLUE('Usage:'));
  console.error('- esbuild start: start the devserver.');
  console.error('- esbuild build: generate production build.');
  console.error('- esbuild help: display command line usages.');
}

async function runner(command: string) {
  switch (command) {
    case 'start':
      await startCommand();
      return true;
    case 'build':
      return buildCommand();
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
    if (!(await runner(process.argv[2] || ''))) process.exitCode = 1;
  } catch (error) {
    console.error(RED(error));
    process.exitCode = 1;
  }
}

main();
