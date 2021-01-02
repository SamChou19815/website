import { readFileSync } from 'fs';
import { join } from 'path';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import {
  githubActionWorkflowToString,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from './github-actions-ast';

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
): boolean => {
  const oneWorkspace = workspacesJson.information[workspace];
  if (oneWorkspace == null) throw new Error();
  return (
    JSON.parse(readFileSync(join(oneWorkspace.workspaceLocation, 'package.json')).toString())
      ?.scripts?.[script] != null
  );
};

const githubActionsCodegenService = (): readonly (readonly [string, string])[] => {
  const workspacesJson: YarnWorkspacesJson = JSON.parse(readFileSync('workspaces.json').toString());
  return [
    [
      '.github/workflows/generated-general.yml',
      githubActionWorkflowToString({
        workflowName: 'General',
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
    ] as const,
    ...workspacesJson.topologicallyOrdered
      .filter((name) => hasScript(workspacesJson, name, 'deploy'))
      .map((workspace) => {
        const name = `cd-${workspace}`;
        return [
          `.github/workflows/generated-${name}.yml`,
          githubActionWorkflowToString({
            workflowName: `CD ${workspace}`,
            workflowMasterBranchOnlyTriggerPaths: [
              ...(workspacesJson.information[workspace]?.dependencyChain ?? []).map(
                (workspaceDependency: string) =>
                  `${workspacesJson.information[workspaceDependency]?.workspaceLocation}/**`
              ),
              'configuration/**',
              `.github/workflows/generated-*-${workspace}.yml`,
            ],
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
        ] as const;
      }),
  ];
};

export default githubActionsCodegenService;
