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
          githubActionJobRunStep('Codegen', `yarn node packages/monorail/bin/index.js codegen`),
          githubActionJobRunStep(
            'Check changed',
            'if [[ `git status --porcelain` ]]; then exit 1; fi'
          ),
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

const githubActionsCodegenService: CodegenService = createJsonCodegenService<YarnWorkspacesJson>(
  'GitHub Actions Workflows Codegen',
  (sourceFilename) => sourceFilename === 'workspaces.json',
  (_, workspacesJson) => {
    return [
      generateTSJSWorkflow(),
      ...Object.entries(getYarnWorkspaceWorkflows(workspacesJson)),
    ].map(([name, workflow]) => ({
      outputFilename: `.github/workflows/generated-${name}.yml`,
      outputContent: githubActionWorkflowToString(workflow),
    }));
  }
);

const ignoreFileCodegenService: CodegenService = {
  name: 'Ignore Files Codegen',
  sourceFileIsRelevant: (sourceFilename) => sourceFilename === '.gitignore',
  run: (_, gitignoreContent) => {
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
