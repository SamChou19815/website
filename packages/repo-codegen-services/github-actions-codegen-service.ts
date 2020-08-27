import { readFileSync } from 'fs';
import { join } from 'path';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import {
  GitHubActionsWorkflow,
  githubActionWorkflowToString,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from './github-actions-ast';

import { CodegenService, createJsonCodegenService } from 'lib-codegen';

const GITHUB_ACTIONS_CHECKOUT_STEP = githubActionJobActionStep('actions/checkout@v2');

const GITHUB_ACTIONS_SETUP_NODE_STEP = githubActionJobActionStep('actions/setup-node@v2-beta');

const GITHUB_ACTIONS_USE_YARN_CACHE_STEP = githubActionJobActionStep('actions/cache@v2', {
  path: '.yarn/cache\\n.pnp.js',
  // eslint-disable-next-line no-template-curly-in-string
  key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
  'restore-keys': 'yarn-berry-',
});

const yarnWorkspaceBoilterplateSetupSteps = [
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
];

const hasScript = (
  workspacesJson: YarnWorkspacesJson,
  workspace: string,
  script: string
): boolean =>
  JSON.parse(
    readFileSync(
      join(workspacesJson.information[workspace].workspaceLocation, 'package.json')
    ).toString()
  )?.scripts?.[script] != null;

const generateTSJSWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'general',
  {
    workflowName: 'General',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      [
        'lint',
        [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Format Check', 'yarn format:check'),
          githubActionJobRunStep('Lint', 'yarn lint'),
        ],
      ],
      [
        'build',
        [
          githubActionJobActionStep('actions/checkout@v2', { 'fetch-depth': '2' }),
          GITHUB_ACTIONS_SETUP_NODE_STEP,
          GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
          githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
          githubActionJobRunStep('Build', 'yarn compile'),
        ],
      ],
      [
        'validate',
        [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Check Codegen', 'yarn codegen'),
          githubActionJobRunStep(
            'Check changed',
            'if [[ `git status --porcelain` ]]; then exit 1; fi'
          ),
        ],
      ],
      [
        'test',
        [...yarnWorkspaceBoilterplateSetupSteps, githubActionJobRunStep('Test', 'yarn test')],
      ],
    ],
  },
];

export const getYarnWorkspaceWorkflows = (
  workspacesJson: YarnWorkspacesJson
): (readonly [string, GitHubActionsWorkflow])[] =>
  workspacesJson.topologicallyOrdered
    .filter((name) => hasScript(workspacesJson, name, 'deploy'))
    .map((workspace) => {
      const name = `cd-${workspace}`;
      return [
        name,
        {
          workflowName: `CD ${workspace}`,
          workflowtrigger: {
            triggerPaths: [
              ...workspacesJson.information[workspace].dependencyChain.map(
                (workspaceDependency: string) =>
                  `${workspacesJson.information[workspaceDependency].workspaceLocation}/**`
              ),
              'configuration/**',
              `.github/workflows/generated-*-${workspace}.yml`,
            ],
            masterBranchOnly: true,
          },
          workflowJobs: [
            [
              'deploy',
              [
                ...yarnWorkspaceBoilterplateSetupSteps,
                githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
                githubActionJobRunStep(
                  'Install firebase-tools',
                  'sudo npm install -g firebase-tools'
                ),
                githubActionJobRunStep(
                  'Deploy',
                  `FIREBASE_TOKEN=\${{ secrets.FIREBASE_TOKEN }} yarn workspace ${workspace} deploy`
                ),
              ],
            ],
          ],
        },
      ];
    });

const githubActionsCodegenService: CodegenService = createJsonCodegenService<YarnWorkspacesJson>(
  'GitHub Actions Workflows Codegen',
  (sourceFilename) => sourceFilename === 'workspaces.json',
  (_, workspacesJson) => {
    return [generateTSJSWorkflow(), ...getYarnWorkspaceWorkflows(workspacesJson)].map(
      ([name, workflow]) => ({
        outputFilename: `.github/workflows/generated-${name}.yml`,
        outputContent: githubActionWorkflowToString(workflow),
      })
    );
  }
);

export default githubActionsCodegenService;
