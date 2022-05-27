/* eslint-disable no-console */

import buildCommand from './commands/command-build';
import startCommand from './commands/command-start';

function help() {
  console.error('Usage:');
  console.error('- esbuild-script start: start the devserver.');
  console.error('- esbuild-script build: generate production build.');
  console.error('- esbuild-script ssg: generate static site.');
  console.error('- esbuild-script help: display command line usages.');
}

async function runner() {
  const command = process.argv[2] || '';
  switch (command) {
    case 'start':
      await startCommand();
      return true;
    case 'ssg':
      return buildCommand(true);
    case 'build':
      return buildCommand(false);
    case 'help':
    case '--help':
      help();
      return true;
    default:
      console.error(`Unknown command: '${command}'`);
      help();
      return false;
  }
}

export default async function main(initialization?: () => Promise<unknown>): Promise<void> {
  await initialization?.();
  try {
    if (!(await runner())) process.exitCode = 1;
  } catch (error) {
    console.error('Internal Error');
    console.error(error);
    process.exitCode = 1;
  }
}
