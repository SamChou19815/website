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
      workflowName: 'lint-generated',
      workflowtrigger: { triggerPaths: ['**'], masterBranchOnly: false },
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
    paths:
      - '**'

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
