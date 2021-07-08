import { writeFileSync } from 'fs';

import type { Plugin, Hooks } from '@yarnpkg/core';
import { Command } from 'clipanion';

import runCodegen from './codegen';
import incrementalCompile from './compile';

class CompileCommand extends Command {
  static paths = [['c']];
  // eslint-disable-next-line class-methods-use-this
  async execute(): Promise<number> {
    return (await incrementalCompile()) ? 0 : 1;
  }
}

const plugin: Plugin<Hooks> = {
  hooks: {
    afterAllInstalled() {
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
