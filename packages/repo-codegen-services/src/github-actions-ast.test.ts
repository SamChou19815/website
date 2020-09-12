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
      workflowJobs: [],
    })
  ).toBe(`# ${GENERATED}

name: example-workflow
on:
  push:
    branches:
      - master
  pull_request:

jobs:
`);
});

it('githubActionWorkflowToString() works as expected test 2', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'example-workflow',
      workflowMasterBranchOnlyTriggerPaths: ['foo', 'bar'],
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

it('githubActionWorkflowToString() works as expected test 3', () => {
  expect(
    githubActionWorkflowToString({
      workflowName: 'lint-generated',
      workflowJobs: [
        [
          'lint',
          [
            githubActionJobActionStep('actions/checkout@master'),
            githubActionJobRunStep('Yarn Install', 'yarn install'),
          ],
        ],
        ['dummy', [githubActionJobActionStep('actions/checkout@master')]],
      ],
    })
  ).toBe(`# ${GENERATED}

name: lint-generated
on:
  push:
    branches:
      - master
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Yarn Install
        run: yarn install
  dummy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
`);
});
