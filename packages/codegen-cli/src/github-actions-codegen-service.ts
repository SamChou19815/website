import { readFileSync } from 'fs';
import { join } from 'path';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

const yarnWorkspaceBoilterplateSetupString = `
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: "2"
      - uses: actions/setup-node@v2-beta
      - uses: actions/cache@v2
        with:
          path: ".yarn/cache\\n.pnp.js"
          key: "yarn-berry-\${{ hashFiles('**/yarn.lock') }}"
          restore-keys: "yarn-berry-"
      - name: Yarn Install
        run: yarn install --immutable`;

const hasScript = (
  workspacesJson: YarnWorkspacesJson,
  workspace: string,
  script: string
): boolean => {
  const oneWorkspace = workspacesJson.information[workspace];
  if (oneWorkspace == null) throw new Error();
  return (
    JSON.parse(readFileSync(join(oneWorkspace.workspaceLocation, 'package.json')).toString())
      ?.scripts?.[script] != null
  );
};

const githubActionsCodegenService = (): readonly (readonly [string, string])[] => {
  const workspacesJson: YarnWorkspacesJson = JSON.parse(readFileSync('workspaces.json').toString());
  return [
    [
      '.github/workflows/generated-general.yml',
      `# @${'generated'}

name: General
on:
  push:
    branches:
      - master
  pull_request:

jobs:
  lint:${yarnWorkspaceBoilterplateSetupString}
      - name: Format Check
        run: yarn format:check
      - name: Lint
        run: yarn lint
  build:${yarnWorkspaceBoilterplateSetupString}
      - name: Compile
        run: yarn compile
  validate:${yarnWorkspaceBoilterplateSetupString}
      - name: Codegen
        run: yarn codegen
      - name: Check changed
        run: if [[ \`git status --porcelain\` ]]; then exit 1; fi
  test:${yarnWorkspaceBoilterplateSetupString}
      - name: Test
        run: yarn test
`,
    ] as const,
    ...workspacesJson.topologicallyOrdered
      .filter((name) => hasScript(workspacesJson, name, 'deploy'))
      .map((workspace) => {
        const name = `cd-${workspace}`;

        return [
          `.github/workflows/generated-${name}.yml`,
          `# @${'generated'}

name: CD ${workspace}
on:
  push:
    paths:${(workspacesJson.information[workspace]?.dependencyChain ?? [])
      .map(
        (workspaceDependency: string) =>
          `\n      - '${workspacesJson.information[workspaceDependency]?.workspaceLocation}/**'`
      )
      .join('')}
      - 'configuration/**'
      - '.github/workflows/generated-*-${workspace}.yml'
    branches:
      - master

jobs:
  deploy:${yarnWorkspaceBoilterplateSetupString}
      - name: Build
        run: yarn workspace ${workspace} build
      - name: Install Firebase
        run: sudo npm install -g firebase-tools
      - name: Deploy
        run: FIREBASE_TOKEN=\${{ secrets.FIREBASE_TOKEN }} yarn workspace ${workspace} deploy
`,
        ] as const;
      }),
  ];
};

export default githubActionsCodegenService;
