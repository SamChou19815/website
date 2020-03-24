// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { writeFileSync } from 'fs';

import { projectWorkspaces, getDependencyChain } from './workspace';

const getBoilterPlateSetupSteps = (jobName: string): string => `jobs:
  ${jobName}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Use Yarn Cache
        uses: actions/cache@v1
        with:
          path: ~/.cache/yarn
          key: yarn-\${{ hashFiles(format('{0}{1}', github.workspace, '/yarn.lock')) }}
          restore-keys: yarn-
      - name: Yarn Install
        run: yarn install`;

const getPathsString = (workspace: string): string => {
  const allPaths = [
    ...getDependencyChain(workspace).map((dependency) => `packages/${dependency}/**`),
    'package.json',
    'yarn.lock',
    'configuration/**',
    `.github/workflows/generated-*-${workspace}.yml`,
  ];
  return allPaths.map((path) => `      - ${path}`).join('\n');
};

const generateFrontendCIWorkflow = (workspace: string): readonly [string, string] => {
  const filename = `generated-ci-${workspace}.yml`;
  const content = `# @generated

name: CI ${workspace}
on:
  push:
    paths:
${getPathsString(workspace)}

${getBoilterPlateSetupSteps('build')}
      - name: Compile
        run: yarn workspace ${workspace} compile
      - name: Test
        run: yarn workspace ${workspace} test
`;
  return [filename, content];
};

const generateFrontendCDWorkflow = (workspace: string): readonly [string, string] => {
  const filename = `generated-cd-${workspace}.yml`;
  const content = `# @generated

name: CD ${workspace}
on:
  push:
    branches:
      - master
    paths:
${getPathsString(workspace)}
env:
  FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}

${getBoilterPlateSetupSteps('deploy')}
      - name: Build
        run: yarn workspace ${workspace} build
      - name: Deploy
        run: yarn workspace ${workspace} deploy
`;
  return [filename, content];
};

const writeGeneratedFile = ([filename, content]: readonly [string, string]): void =>
  writeFileSync(`.github/workflows/${filename}`, content);

const main = (): void => {
  projectWorkspaces.forEach((workspace) => {
    writeGeneratedFile(generateFrontendCIWorkflow(workspace));
    writeGeneratedFile(generateFrontendCDWorkflow(workspace));
  });
};

// eslint-disable-next-line import/prefer-default-export
export { main };
