import { writeFileSync } from 'fs';

import type { CommandContext, Hooks, Plugin } from '@yarnpkg/core';
import { Command } from 'clipanion';

import incrementalCompile from './compile';
import generateYarnWorkspacesJson from './workspaces-json';

class CompileCommand extends Command<CommandContext> {
  static paths = [['c']];
  // eslint-disable-next-line class-methods-use-this
  async execute(): Promise<number> {
    return (await incrementalCompile()) ? 0 : 1;
  }
}

const plugin: Plugin<Hooks> = {
  hooks: {
    afterAllInstalled(project) {
      writeFileSync(
        'workspaces.json',
        `${JSON.stringify(generateYarnWorkspacesJson(project), undefined, 2)}\n`
      );
    },
  },
  commands: [CompileCommand],
};

export default plugin;
