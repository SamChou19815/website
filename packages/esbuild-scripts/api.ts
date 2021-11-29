/* eslint-disable no-console */

import buildCommand from './commands/command-build';
import startCommand from './commands/command-start';
import type { VirtualPathMappings } from './esbuild/esbuild-plugins';

function help() {
  console.error('Usage:');
  console.error('- esbuild-script start: start the devserver.');
  console.error('- esbuild-script build: generate production build.');
  console.error('- esbuild-script ssg: generate static site.');
  console.error('- esbuild-script help: display command line usages.');
}

async function runner(virtualEntryComponents: VirtualPathMappings) {
  const command = process.argv[2] || '';
  switch (command) {
    case 'start':
      await startCommand(virtualEntryComponents);
      return true;
    case 'ssg':
      return buildCommand(virtualEntryComponents, true);
    case 'build':
      return buildCommand(virtualEntryComponents, false);
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

export default async function main(
  generateVirtualEntryComponents?: () => Promise<VirtualPathMappings>
): Promise<void> {
  const virtualEntryComponents = generateVirtualEntryComponents
    ? await generateVirtualEntryComponents()
    : {};
  try {
    if (!(await runner(virtualEntryComponents))) process.exitCode = 1;
  } catch (error) {
    process.exitCode = 1;
  }
}
