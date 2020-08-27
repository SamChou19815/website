import { readFileSync } from 'fs';
import { join } from 'path';

import { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import { GitHubActionsWorkflow, githubActionJobRunStep } from '../ast/github-actions';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
} from './github-actions-primitives';

export const yarnWorkspaceBoilterplateSetupSteps = [
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
];

const workspacesJson: YarnWorkspacesJson = JSON.parse(readFileSync('workspaces.json').toString());

const isDeployable = (name: string): boolean =>
  JSON.parse(
    readFileSync(
      join(workspacesJson.information[name].workspaceLocation, 'package.json')
    ).toString()
  )?.scripts?.deploy != null;

export const getYarnWorkspaceWorkflows = (): Record<string, GitHubActionsWorkflow> =>
  Object.fromEntries([
    ...workspacesJson.topologicallyOrdered.filter(isDeployable).map((workspace: string) => {
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
          workflowSecrets: ['FIREBASE_TOKEN'],
          workflowJobs: [
            {
              jobName: 'deploy',
              jobSteps: [
                ...yarnWorkspaceBoilterplateSetupSteps,
                githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
                githubActionJobRunStep(
                  'Install firebase-tools',
                  'sudo npm install -g firebase-tools'
                ),
                githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
              ],
            },
          ],
        },
      ];
    }),
  ]);
