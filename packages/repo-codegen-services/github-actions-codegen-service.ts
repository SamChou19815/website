import { readFileSync } from 'fs';
import { join } from 'path';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import {
  githubActionWorkflowToString,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from './github-actions-ast';

import { CodegenService, createJsonCodegenService } from 'lib-codegen';

const yarnWorkspaceBoilterplateSetupSteps = [
  githubActionJobActionStep('actions/checkout@v2', {
    'fetch-depth': '2',
  }),
  githubActionJobActionStep('actions/setup-node@v2-beta'),
  githubActionJobActionStep('actions/cache@v2', {
    path: '.yarn/cache\\n.pnp.js',
    // eslint-disable-next-line no-template-curly-in-string
    key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
    'restore-keys': 'yarn-berry-',
  }),
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

const githubActionsCodegenService: CodegenService = createJsonCodegenService<YarnWorkspacesJson>(
  'GitHub Actions Workflows Codegen',
  (sourceFilename) => sourceFilename === 'workspaces.json',
  (_, workspacesJson) => [
    {
      outputFilename: '.github/workflows/generated-general.yml',
      outputContent: githubActionWorkflowToString({
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
              ...yarnWorkspaceBoilterplateSetupSteps,
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
      }),
    },
    ...workspacesJson.topologicallyOrdered
      .filter((name) => hasScript(workspacesJson, name, 'deploy'))
      .map((workspace) => {
        const name = `cd-${workspace}`;
        return {
          outputFilename: `.github/workflows/generated-${name}.yml`,
          outputContent: githubActionWorkflowToString({
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
                  githubActionJobRunStep('Install firebase', 'sudo npm install -g firebase-tools'),
                  githubActionJobRunStep(
                    'Deploy',
                    `FIREBASE_TOKEN=\${{ secrets.FIREBASE_TOKEN }} yarn workspace ${workspace} deploy`
                  ),
                ],
              ],
            ],
          }),
        };
      }),
  ]
);

export default githubActionsCodegenService;
