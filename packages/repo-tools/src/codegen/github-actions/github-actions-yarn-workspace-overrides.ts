import {
  GitHubActionJobStep,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from '../ast/github-actions';
import { YarnWorkspaceWorkflowsOverrides } from './github-actions-yarn-workspaces';

const setupPrivateMonorepoForVault: readonly GitHubActionJobStep[] = [
  githubActionJobActionStep('actions/checkout@v2', {
    repository: 'SamChou19815/private-monorepo',
    // eslint-disable-next-line no-template-curly-in-string
    token: '${{ secrets.DEPLOY_GH_PAGE_TOKEN }}',
    path: 'private-monorepo',
  }),
  githubActionJobRunStep(
    'Move private-monorepo to be side-by-side with website repo',
    'cp -R private-monorepo/. ../private-monorepo\nrm -rf private-monorepo'
  ),
  githubActionJobRunStep(
    'Sanity Check private-monorepo setup',
    'cat ../private-monorepo/README.md'
  ),
];

const workspaceSpecificOverrides: YarnWorkspaceWorkflowsOverrides = {
  'ci-vault': setupPrivateMonorepoForVault,
  'cd-vault': setupPrivateMonorepoForVault,
};

export default workspaceSpecificOverrides;
