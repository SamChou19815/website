import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';

import {
  githubActionJobActionStep,
  githubActionJobRunStep,
  githubActionWorkflowToString,
} from './codegen/ast/github-actions';
import {
  allPrivateWorkspaces,
  libraryWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from './workspace';

const getDependencyPaths = (workspace: string): readonly string[] => [
  ...getDependencyChain(workspace).map((dependency) => `packages/${dependency}/**`),
  'package.json',
  'yarn.lock',
  'configuration/**',
  `.github/workflows/generated-*-${workspace}.yml`,
];

const generateFrontendCIWorkflow = (workspace: string): readonly [string, string] => {
  const filename = `generated-ci-${workspace}.yml`;
  const content = githubActionWorkflowToString({
    workflowName: `CI ${workspace}`,
    workflowtrigger: {
      triggerPaths: getDependencyPaths(workspace),
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'build',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2'),
          githubActionJobActionStep('actions/setup-node@v1'),
          githubActionJobActionStep('actions/cache@v2', {
            path: '.yarn/cache\n.pnp.js',
            // eslint-disable-next-line no-template-curly-in-string
            key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
            'restore-keys': 'yarn-berry-',
          }),
          githubActionJobRunStep('Yarn Install', 'yarn install'),
          githubActionJobRunStep('Compile', `yarn workspace ${workspace} compile`),
        ],
      },
    ],
  });
  return [filename, content];
};

const generateFrontendCDWorkflow = (workspace: string): readonly [string, string] => {
  const filename = `generated-cd-${workspace}.yml`;
  const content = githubActionWorkflowToString({
    workflowName: `CD ${workspace}`,
    workflowtrigger: {
      triggerPaths: getDependencyPaths(workspace),
      masterBranchOnly: true,
    },
    workflowSecrets: ['FIREBASE_TOKEN'],
    workflowJobs: [
      {
        jobName: 'deploy',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2'),
          githubActionJobActionStep('actions/setup-node@v1'),
          githubActionJobActionStep('actions/cache@v2', {
            path: '.yarn/cache\n.pnp.js',
            // eslint-disable-next-line no-template-curly-in-string
            key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
            'restore-keys': 'yarn-berry-',
          }),
          githubActionJobRunStep('Yarn Install', 'yarn install'),
          githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
          githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
        ],
      },
    ],
  });
  return [filename, content];
};

const writeGeneratedFile = ([filename, content]: readonly [string, string]): void =>
  writeFileSync(`.github/workflows/${filename}`, content);

const generateIgnoreFiles = (): void => {
  const content = readFileSync('.gitignore');
  const additionalIgnores = `
# styles

.yarn
packages/lib-docusaurus-plugin/index.js
packages/repo-tools/bin/
`;
  writeFileSync('.eslintignore', content + additionalIgnores);
  writeFileSync('.prettierignore', content + additionalIgnores);
};

const generate = (): void => {
  Array.from(readdirSync('.github/workflows'))
    .filter((filename) => filename.includes('generated-'))
    .forEach((filename) => unlinkSync(`.github/workflows/${filename}`));
  allPrivateWorkspaces.forEach((workspace) => {
    writeGeneratedFile(generateFrontendCIWorkflow(workspace));
  });
  projectWorkspaces.forEach((workspace) => {
    writeGeneratedFile(generateFrontendCDWorkflow(workspace));
  });
  writeFileSync(
    'configuration/libraries.json',
    `${JSON.stringify(libraryWorkspaces, undefined, 2)}\n`
  );
  generateIgnoreFiles();
};

export default generate;
