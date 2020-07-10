import { PROJECT_CONFIGURATION } from '../../configuration';
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
  githubActionJobRunStep(
    `Checkout ${PROJECT_CONFIGURATION.organizationName}/${repositoryName}`,
    `cd ../ && git clone https://\${{ secrets.DEPLOY_GH_PAGE_TOKEN }}@github.com/${PROJECT_CONFIGURATION.organizationName}/${repositoryName} --depth 1`
  ),
  githubActionJobRunStep(
    `Sanity Check ${repositoryName} setup`,
    `cat ../${repositoryName}/README.md`
  ),
];

const GITHUB_ACTIONS_GOOGLE_CLOUD_SDK_SETUP_STEP: GitHubActionJobStep = githubActionJobActionStep(
  'GoogleCloudPlatform/github-actions/setup-gcloud@master',
  {
    project_id: 'developer-sam',
    // eslint-disable-next-line no-template-curly-in-string
    service_account_key: '${{ secrets.GCP_SERVICE_ACCOUNT_KEY }}',
    export_default_credentials: 'true',
  }
);

export const getDeploymentDependencySetupStep = (
  deploymentDependency: string
): GitHubActionJobStep => {
  if (deploymentDependency === 'gcloud') {
    return GITHUB_ACTIONS_GOOGLE_CLOUD_SDK_SETUP_STEP;
  }
  throw new Error(`Unsupported deployment dependency: ${deploymentDependency}`);
};