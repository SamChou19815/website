import { GitHubActionJobStep, githubActionJobActionStep } from '../ast/github-actions';

export const GITHUB_ACTIONS_CHECKOUT_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'actions/checkout@v2'
);

export const GITHUB_ACTIONS_SETUP_NODE_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'actions/setup-node@v2-beta',
  { 'node-version': "'12'" }
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
