import { writeFileSync } from 'fs';

import type { Plugin, Hooks } from '@yarnpkg/core';
import { Command } from 'clipanion';

import incrementalCompile from './compile';
import generateYarnWorkspacesJson from './workspaces-json';

class CompileCommand extends Command {
  static paths = [['c']];
  // eslint-disable-next-line class-methods-use-this
  async execute(): Promise<number> {
    return (await incrementalCompile()) ? 0 : 1;
  }
}

const plugin: Plugin<Hooks> = {
  hooks: {
    afterAllInstalled(project) {
      const workspacesJson: YarnWorkspacesJson = generateYarnWorkspacesJson(project);
      writeFileSync('workspaces.json', `${JSON.stringify(workspacesJson, undefined, 2)}\n`);
    },
  },
  // @ts-expect-error: version discrepancy?
  commands: [CompileCommand],
};

export default plugin;
