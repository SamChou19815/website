import { getDependencyChain } from './workspace';

const indentedLine = (text: string, space: number): string => `${' '.repeat(space)}${text}`;

const getPaths = (dependencyChain: readonly string[]): string => dependencyChain.map((dependency) => indentedLine(`- ${dependency}/**`, 6)).join('\n');

const getBuildCommands = (dependencyChain: readonly string[]): string => {
  const commands: string[] = [];
  dependencyChain.slice(0, dependencyChain.length - 1).forEach((dependency) => {
    commands.push(
      `${indentedLine(`- name: Build dependency ${dependency}`, 6)}`,
      `${indentedLine(`  run: yarn workspace ${dependency} build`, 6)}`,
    );
  });
  const workspace = dependencyChain[dependencyChain.length - 1];
  commands.push(
    `${indentedLine(`- name: Build ${workspace}`, 6)}`,
    `${indentedLine(`  run: yarn workspace ${workspace} build`, 6)}`,
  );
  return commands.join('\n');
};

const generateFrontendPackageCIWorkflow = (workspace: string): [string, string] => {
  const dependencyChain = getDependencyChain(workspace);
  const ymlContent = `# @generated

name: ci-${workspace}
on:
  pull_request:
    paths:
      - .github/workflows/ci-workflow-${workspace}.yml
      - package.json
      - configuration/**
      - tooling/**
${getPaths(dependencyChain)}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install

${getBuildCommands(dependencyChain)}
`;
  return [`ci-workflow-${workspace}.yml`, ymlContent];
};

const generateFrontendPackageCDWorkflow = (
  workspace: string,
  deployStepGenerator: () => string,
): [string, string] => {
  const dependencyChain = getDependencyChain(workspace);
  const ymlContent = `# @generated

name: cd-${workspace}
on:
  push:
    branches:
      - master
    paths:
      - .github/workflows/cd-workflow-${workspace}.yml
      - package.json
      - configuration/**
      - tooling/**
${getPaths(dependencyChain)}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install

${getBuildCommands(dependencyChain)}
${deployStepGenerator()}
`;
  return [`cd-workflow-${workspace}.yml`, ymlContent];
};

const generateReactFrontendPackageCDWorkflow = (workspace: string): [string, string] => {
  const deployStepGenerator = (): string => `
      - name: Deploy ${workspace}
        env:
          FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}
        run: |
          ./tooling/node_modules/.bin/firebase deploy \\
          --token=$FIREBASE_TOKEN --non-interactive --only hosting:${workspace}`;
  return generateFrontendPackageCDWorkflow(workspace, deployStepGenerator);
};

const generateBlogPackageCDWorkflow = (): [string, string] => {
  const deployStepGenerator = (): string => `
      - name: Build & Deploy blog
        env:
          DEPLOY_GH_PAGE_TOKEN: \${{ secrets.DEPLOY_GH_PAGE_TOKEN }}
          FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}
        run: |
          git config --global user.name "SamChou19815"
          git config --global user.email "sam@developersam.com"
          GIT_USER=$DEPLOY_GH_PAGE_TOKEN yarn workspace blog deploy`;
  return generateFrontendPackageCDWorkflow('blog', deployStepGenerator);
};

/**
 * @returns a list of tuple: (workflow file name, workflow file content),
 */
export default (): readonly [string, string][] => [
  // CI
  generateFrontendPackageCIWorkflow('blog'),
  generateFrontendPackageCIWorkflow('main-site-frontend'),
  generateFrontendPackageCIWorkflow('sam-highlighter'),
  generateFrontendPackageCIWorkflow('samlang-demo-frontend'),
  generateFrontendPackageCIWorkflow('ten-web-frontend'),
  // CD
  generateBlogPackageCDWorkflow(),
  generateReactFrontendPackageCDWorkflow('main-site-frontend'),
  generateReactFrontendPackageCDWorkflow('samlang-demo-frontend'),
  generateReactFrontendPackageCDWorkflow('ten-web-frontend'),
];
