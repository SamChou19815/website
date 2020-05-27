import {
  allPrivateWorkspaces,
  libraryWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from './workspace.ts';

const readFile = (filename: string): string =>
  new TextDecoder().decode(Deno.readFileSync(filename));
const writeFile = (filename: string, content: string): void =>
  Deno.writeFileSync(filename, new TextEncoder().encode(content));

const getBoilterPlateSetupSteps = (jobName: string): string => `jobs:
  ${jobName}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
      - uses: actions/cache@v2
        with:
          path: |
            .yarn/cache
            .pnp.js
          key: yarn-berry-\${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            yarn-berry-
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
  writeFile(`.github/workflows/${filename}`, content);

const generateIgnoreFiles = (): void => {
  const content = readFile('.gitignore');
  const additionalStyleIgnores = '# styles\n.yarn\npackages/lib-docusaurus-plugin/index.js\n';
  writeFile('.eslintignore', content + additionalStyleIgnores);
  writeFile('.prettierignore', content + additionalStyleIgnores);
};

const main = (): void => {
  Array.from(Deno.readDirSync('.github/workflows'))
    .filter((entry) => entry.name.includes('generated-'))
    .forEach((entry) => Deno.removeSync(`.github/workflows/${entry.name}`));
  allPrivateWorkspaces.forEach((workspace) => {
    writeGeneratedFile(generateFrontendCIWorkflow(workspace));
  });
  projectWorkspaces.forEach((workspace) => {
    writeGeneratedFile(generateFrontendCDWorkflow(workspace));
  });
  writeFile('configuration/libraries.json', `${JSON.stringify(libraryWorkspaces, undefined, 2)}\n`);
  generateIgnoreFiles();
};

main();
