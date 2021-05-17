import { writeFileSync } from 'fs';

import { Command } from 'clipanion';

import runCodegen from './codegen';
import incrementalCompile from './compile';

import type { Plugin } from '@yarnpkg/core';

class CompileCommand extends Command {
  // eslint-disable-next-line class-methods-use-this
  async execute(): Promise<number> {
    return (await incrementalCompile()) ? 0 : 1;
  }
}

CompileCommand.addPath('c');

const plugin: Plugin = {
  hooks: {
    afterAllInstalled: (): void => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const workspacesJson: YarnWorkspacesJson = require('./query').default;
      writeFileSync('workspaces.json', `${JSON.stringify(workspacesJson, undefined, 2)}\n`);
      runCodegen(workspacesJson);
    },
  },
  // @ts-expect-error: version discrepancy?
  commands: [CompileCommand],
};

export default plugin;
