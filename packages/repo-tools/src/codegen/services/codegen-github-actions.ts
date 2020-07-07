import {
  GitHubActionsWorkflow,
  githubActionJobActionStep,
  githubActionJobRunStep,
  githubActionWorkflowToString,
} from '../ast/github-actions';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
} from '../github-actions/github-actions-primitives';
import workspaceSpecificOverrides from '../github-actions/github-actions-yarn-workspace-overrides';
import {
  yarnWorkspaceBoilterplateSetupSteps,
  getYarnWorkspaceWorkflows,
} from '../github-actions/github-actions-yarn-workspaces';
import { CodegenService } from './codegen-service-types';

const generateDummyWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'dummy',
  {
    workflowName: 'Dummy',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [githubActionJobRunStep('Success', 'echo "Lint nothing."')],
      },
      {
        jobName: 'build',
        jobSteps: [githubActionJobRunStep('Success', 'echo "Build nothing."')],
      },
      {
        jobName: 'test',
        jobSteps: [githubActionJobRunStep('Success', 'echo "Test nothing."')],
      },
    ],
  },
];

const generateTSJSWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'ts-js',
  {
    workflowName: 'TS and JS',
    workflowtrigger: {
      triggerPaths: ['.github/workflows/generated-ts-js.yml', '**.js', '**.ts', '**.jsx', '**.tsx'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Lint', 'yarn lint'),
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

const generateLintMarkdownWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'lint-markdown',
  {
    workflowName: 'lint-markdown',
    workflowtrigger: {
      triggerPaths: ['.github/workflows/generated-lint-markdown.yml'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2'),
          githubActionJobActionStep('actions/setup-ruby@v1'),
          githubActionJobRunStep('Setup Markdown Lint', 'gem install mdl'),
          githubActionJobRunStep('Run Markdown Lint', 'mdl .'),
        ],
      },
    ],
  },
];

const generateCodegenPorcelainWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'codegen-porcelain',
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
          githubActionJobRunStep('Codegen', './repo-tools codegen'),
          githubActionJobRunStep('Check changed', 'git status --porcelain'),
        ],
      },
    ],
  },
];

const githubActionsCodegenService: CodegenService = {
  serviceName: 'Generate GitHub Actions Workflow',
  generatedFilenamePattern: '.github/workflows/generated-*',
  generatedCodeContentList: [
    generateDummyWorkflow(),
    generateTSJSWorkflow(),
    generateLintMarkdownWorkflow(),
    generateCodegenPorcelainWorkflow(),
    ...Object.entries(getYarnWorkspaceWorkflows(workspaceSpecificOverrides)),
  ].map(([name, workflow]) => ({
    pathForGeneratedCode: `.github/workflows/generated-${name}.yml`,
    generatedCode: githubActionWorkflowToString(workflow),
  })),
};

export default githubActionsCodegenService;
