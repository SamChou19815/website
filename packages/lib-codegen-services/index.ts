import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import {
  GitHubActionsWorkflow,
  githubActionJobRunStep,
  githubActionWorkflowToString,
  githubActionJobActionStep,
} from './github-actions-ast';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
} from './github-actions-primitives';
import {
  yarnWorkspaceBoilterplateSetupSteps,
  getYarnWorkspaceWorkflows,
} from './github-actions-yarn-workspaces';

import { CodegenService, createJsonCodegenService } from 'lib-codegen';

// TODO: DO NOT HARDCODE
const MONORAIL_BINARY_PATH = 'packages/monorail/bin/index.js';

const generateTSJSWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'general',
  {
    workflowName: 'General',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Format Check', 'yarn format:check'),
          githubActionJobRunStep('Lint', 'yarn lint'),
        ],
      },
      {
        jobName: 'build',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2', { 'fetch-depth': '2' }),
          GITHUB_ACTIONS_SETUP_NODE_STEP,
          GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
          githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
          githubActionJobRunStep('Build', 'yarn compile'),
        ],
      },
      {
        jobName: 'test',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Test', 'yarn test'),
        ],
      },
    ],
  },
];

const generateCodegenPorcelainWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'generated-in-sync',
  {
    workflowName: 'lint-generated',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          GITHUB_ACTIONS_CHECKOUT_STEP,
          GITHUB_ACTIONS_SETUP_NODE_STEP,
          githubActionJobRunStep('Codegen', `${MONORAIL_BINARY_PATH} codegen`),
          githubActionJobRunStep(
            'Check changed',
            'if [[ `git status --porcelain` ]]; then exit 1; fi'
          ),
        ],
      },
    ],
  },
];

const githubActionsCodegenService: CodegenService = createJsonCodegenService<YarnWorkspacesJson>(
  'GitHub Actions Workflows Codegen',
  (sourceFilename, workspacesJson) => {
    if (sourceFilename !== 'workspaces.json') return [];
    return [
      generateTSJSWorkflow(),
      generateCodegenPorcelainWorkflow(),
      ...Object.entries(getYarnWorkspaceWorkflows(workspacesJson)),
    ].map(([name, workflow]) => ({
      outputFilename: `.github/workflows/generated-${name}.yml`,
      outputContent: githubActionWorkflowToString(workflow),
    }));
  }
);

const ignoreFileCodegenService: CodegenService = {
  name: 'Ignore Files Codegen',
  run: (sourceFilename, gitignoreContent) => {
    if (sourceFilename !== '.gitignore') return [];

    const styleIgnoreContent = `# ${'@' + 'generated'}

${gitignoreContent}

# additions
.yarn
**/bin/`;

    return [
      { outputFilename: '.eslintignore', outputContent: styleIgnoreContent },
      { outputFilename: '.prettierignore', outputContent: styleIgnoreContent },
    ];
  },
};

const codegenServices: readonly CodegenService[] = [
  githubActionsCodegenService,
  ignoreFileCodegenService,
];

export default codegenServices;
