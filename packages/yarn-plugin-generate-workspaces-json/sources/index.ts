import { writeFileSync } from 'fs';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';
import type { Plugin } from '@yarnpkg/core';

import runCodegen from './codegen';

const plugin: Plugin = {
  hooks: {
    afterAllInstalled: (): void => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const workspacesJson: YarnWorkspacesJson = require('./query').default;
      writeFileSync('workspaces.json', `${JSON.stringify(workspacesJson, undefined, 2)}\n`);
      runCodegen(workspacesJson);
    },
  },
  commands: [],
};

export default plugin;
