import { writeFileSync, readdirSync, unlinkSync } from 'fs';

import {
  toolingWorkspaces,
  nonToolingWorkspaces,
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
  ...getDependencyChain(workspace).map(
    (dependency) =>
      `packages/${
        dependency.startsWith('@dev-sam/') ? dependency.substring('@dev-sam/'.length) : dependency
      }/**`
  ),
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

const generateCIWorkflow = (
  workspaceName: string,
  shortWorkspaceName: string = workspaceName
): readonly [string, string] => {
  const filename = `generated-ci-${shortWorkspaceName}.yml`;
  const content = githubActionWorkflowToString({
    workflowName: `CI ${workspaceName}`,
    workflowtrigger: {
      triggerPaths: getDependencyPaths(workspaceName),
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'build',
        jobSteps: [
          ...boilterplateSteps,
          githubActionJobRunStep('Compile', `yarn workspace ${workspaceName} compile`),
        ],
      },
    ],
  });
  return [filename, content];
};

const generateCDWorkflow = (workspace: string): readonly [string, string] => {
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

const generateCodegenPorcelainWorkflow = (): readonly [string, string] => [
  'generated-codegen-porcelain.yml',
  githubActionWorkflowToString({
    workflowName: 'lint-generated',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2'),
          githubActionJobActionStep('actions/setup-node@v1'),
          githubActionJobRunStep('Codegen', './repo-tools codegen'),
          githubActionJobRunStep('Check changed', 'git status --porcelain'),
        ],
      },
    ],
  }),
];

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
      stepName: 'Generate codegen porcelain check workflow',
      stepCode: (): void => writeGeneratedFile(generateCodegenPorcelainWorkflow()),
    },
    ...toolingWorkspaces.map((workspace) => {
      const workspaceFolderName = workspace.substring('@dev-sam/'.length);
      return {
        stepName: `Generate CI workflow for ${workspaceFolderName}`,
        stepCode: () => writeGeneratedFile(generateCIWorkflow(workspace, workspaceFolderName)),
      };
    }),
    ...nonToolingWorkspaces.map((workspace) => ({
      stepName: `Generate CI workflow for ${workspace}`,
      stepCode: () => writeGeneratedFile(generateCIWorkflow(workspace)),
    })),
    ...projectWorkspaces.map((workspace) => ({
      stepName: `Generate CD workflow for ${workspace}`,
      stepCode: () => writeGeneratedFile(generateCDWorkflow(workspace)),
    })),
  ],
};

export default githubActionsCodegenService;
