import { writeFileSync, readdirSync, unlinkSync } from 'fs';

import {
  allPrivateWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from '../../infrastructure/workspace';
import {
  githubActionJobActionStep,
  githubActionJobRunStep,
  githubActionWorkflowToString,
} from '../ast/github-actions';
import { CodegenService } from './codegen-service-types';

const getDependencyPaths = (workspace: string): readonly string[] => [
  ...getDependencyChain(workspace).map((dependency) => `packages/${dependency}/**`),
  'package.json',
  'yarn.lock',
  'configuration/**',
  `.github/workflows/generated-*-${workspace}.yml`,
];

const boilterplateSteps = [
  githubActionJobActionStep('actions/checkout@v2'),
  githubActionJobActionStep('actions/setup-node@v1'),
  githubActionJobActionStep('actions/cache@v2', {
    path: '.yarn/cache\n.pnp.js',
    // eslint-disable-next-line no-template-curly-in-string
    key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
    'restore-keys': 'yarn-berry-',
  }),
  githubActionJobRunStep('Yarn Install', 'yarn install'),
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
          ...boilterplateSteps,
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
          ...boilterplateSteps,
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

const githubActionsCodegenService: CodegenService = {
  serviceName: 'Generate GitHub Actions Workflow',
  serviceSteps: [
    {
      stepName: 'Remove already generated workflow files.',
      stepCode: (): void => {
        Array.from(readdirSync('.github/workflows'))
          .filter((filename) => filename.includes('generated-'))
          .forEach((filename) => unlinkSync(`.github/workflows/${filename}`));
      },
    },
    {
      stepName: 'Generate CI workflows.',
      stepCode: (): void => {
        allPrivateWorkspaces.forEach((workspace) => {
          writeGeneratedFile(generateFrontendCIWorkflow(workspace));
        });
      },
    },
    {
      stepName: 'Generate CD workflows.',
      stepCode: (): void => {
        projectWorkspaces.forEach((workspace) => {
          writeGeneratedFile(generateFrontendCDWorkflow(workspace));
        });
      },
    },
  ],
};

export default githubActionsCodegenService;
