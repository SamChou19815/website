import {
  GitHubActionJobStep,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from '../ast/github-actions';

export const GITHUB_ACTIONS_CHECKOUT_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'actions/checkout@v2'
);

export const GITHUB_ACTIONS_SETUP_NODE_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'actions/setup-node@v2-beta'
);

export const GITHUB_ACTIONS_USE_YARN_CACHE_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'actions/cache@v2',
  {
    path: '.yarn/cache\n.pnp.js',
    // eslint-disable-next-line no-template-curly-in-string
    key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
    'restore-keys': 'yarn-berry-',
  }
);

export const getDevSamRepositoryDependencySetupSteps = (
  repositoryName: string
): readonly GitHubActionJobStep[] => [
  githubActionJobActionStep('actions/checkout@v2', {
    repository: `SamChou19815/${repositoryName}`,
    // eslint-disable-next-line no-template-curly-in-string
    token: '${{ secrets.DEPLOY_GH_PAGE_TOKEN }}',
    path: repositoryName,
  }),
  githubActionJobRunStep(
    `Move ${repositoryName} to be side-by-side with website repo`,
    `cp -R ${repositoryName}/. ../${repositoryName}\nrm -rf ${repositoryName}`
  ),
  githubActionJobRunStep(
    `Sanity Check ${repositoryName} setup`,
    `cat ../${repositoryName}/README.md`
  ),
];
