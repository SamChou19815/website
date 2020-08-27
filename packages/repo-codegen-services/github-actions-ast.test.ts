import {
  githubActionJobActionStep,
  githubActionJobRunStep,
  githubActionWorkflowToString,
} from './github-actions-ast';

const GENERATED = '@' + 'generated';

it('githubActionWorkflowToString() works as expected test 1', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'example-workflow',
      workflowtrigger: { triggerPaths: ['foo', 'bar'], masterBranchOnly: true },
      workflowSecrets: ['FIREBASE_TOKEN'],
      workflowJobs: [],
    })
  ).toBe(`# ${GENERATED}

name: example-workflow
on:
  push:
    paths:
      - 'foo'
      - 'bar'
    branches:
      - master
env:
  FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}

jobs:
`);
});

it('githubActionWorkflowToString() works as expected test 2', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'example-workflow',
      workflowtrigger: { triggerPaths: ['foo', 'bar'], masterBranchOnly: false },
      workflowJobs: [],
    })
  ).toBe(`# ${GENERATED}

name: example-workflow
on:
  push:
    paths:
      - 'foo'
      - 'bar'

jobs:
`);
});

it('githubActionWorkflowToString() works as expected test 3', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'example-workflow',
      workflowtrigger: { triggerPaths: ['foo', 'bar'], masterBranchOnly: true },
      workflowJobs: [],
    })
  ).toBe(`# ${GENERATED}

name: example-workflow
on:
  push:
    paths:
      - 'foo'
      - 'bar'
    branches:
      - master

jobs:
`);
});

it('githubActionWorkflowToString() works as expected test 4', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'example-workflow',
      workflowtrigger: { triggerPaths: ['foo', 'bar'], masterBranchOnly: false },
      workflowSecrets: ['FIREBASE_TOKEN'],
      workflowJobs: [],
    })
  ).toBe(`# ${GENERATED}

name: example-workflow
on:
  push:
    paths:
      - 'foo'
      - 'bar'
env:
  FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}

jobs:
`);
});

it('githubActionWorkflowToString() works as expected test 5', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'lint-generated',
      workflowtrigger: { triggerPaths: ['**'], masterBranchOnly: false },
      workflowJobs: [
        {
          jobName: 'lint',
          jobSteps: [
            githubActionJobActionStep('actions/checkout@master'),
            githubActionJobActionStep('actions/setup-node@v1'),
            githubActionJobActionStep('actions/cache@v2', {
              path: '.yarn/cache\n.pnp.js',
              // eslint-disable-next-line no-template-curly-in-string
              key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
              'restore-keys': 'yarn-berry-',
            }),
            githubActionJobRunStep('Yarn Install', 'yarn install'),
            githubActionJobRunStep(
              'Compile Code Generetor',
              'yarn workspace @dev-sam/repo-tools compile'
            ),
            githubActionJobRunStep('Generate Workflows', 'yarn codegen'),
            githubActionJobRunStep(
              'Check Changed',
              `git status --porcelain
if [[ \`git status --porcelain\` ]]; then
  echo "Generated files are not in sync!"
  exit 1
else
  echo "Generated files are in sync. Good to go!"
fi`
            ),
          ],
        },
        {
          jobName: 'dummy',
          jobSteps: [githubActionJobActionStep('actions/checkout@master')],
        },
      ],
    })
  ).toBe(`# ${GENERATED}

name: lint-generated
on:
  push:
    paths:
      - '**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: actions/setup-node@v1
      - uses: actions/cache@v2
        with:
          path: |
            .yarn/cache
            .pnp.js
          key: yarn-berry-\${{ hashFiles('**/yarn.lock') }}
          restore-keys: yarn-berry-
      - name: Yarn Install
        run: yarn install
      - name: Compile Code Generetor
        run: yarn workspace @dev-sam/repo-tools compile
      - name: Generate Workflows
        run: yarn codegen
      - name: Check Changed
        run: |
          git status --porcelain
          if [[ \`git status --porcelain\` ]]; then
            echo "Generated files are not in sync!"
            exit 1
          else
            echo "Generated files are in sync. Good to go!"
          fi
  dummy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
`);
});
