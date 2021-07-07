import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const yarnWorkspaceBoilterplateSetupString = `
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: '2'
      - uses: actions/setup-node@v2
        with:
          cache: 'yarn'
      - name: Yarn Install
        run: yarn install --immutable`;

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

const githubActionsCodegenService = (
  workspacesJson: YarnWorkspacesJson
): readonly (readonly [string, string])[] => {
  return [
    [
      '.github/workflows/generated-general.yml',
      `# @${'generated'}

name: General
on:
  push:
    branches:
      - main
  pull_request:

jobs:
  lint:${yarnWorkspaceBoilterplateSetupString}
      - name: Format Check
        run: yarn format:check
      - name: Lint
        run: yarn lint
  build:${yarnWorkspaceBoilterplateSetupString}
      - name: Compile
        run: yarn c
  validate:${yarnWorkspaceBoilterplateSetupString}
      - name: Check changed
        run: if [[ \`git status --porcelain\` ]]; then exit 1; fi
  test:${yarnWorkspaceBoilterplateSetupString}
      - name: Test
        run: yarn test
`,
    ] as const,
    ...workspacesJson.topologicallyOrdered
      .filter((name) => hasScript(workspacesJson, name, 'deploy'))
      .map((workspace) => {
        const name = `cd-${workspace}`;

        return [
          `.github/workflows/generated-${name}.yml`,
          `# @${'generated'}

name: CD ${workspace}
on:
  push:
    paths:${(workspacesJson.information[workspace]?.dependencyChain ?? [])
      .map(
        (workspaceDependency: string) =>
          `\n      - '${workspacesJson.information[workspaceDependency]?.workspaceLocation}/**'`
      )
      .join('')}
      - 'configuration/**'
      - '.github/workflows/generated-*-${workspace}.yml'
    branches:
      - main
env:
  NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}

jobs:
  deploy:${yarnWorkspaceBoilterplateSetupString}
      - name: Build
        run: yarn workspace ${workspace} build
      - name: Deploy
        run: yarn workspace ${workspace} deploy
`,
        ] as const;
      }),
  ];
};

const GITHUB_WORKFLOWS_PATH = join('.github', 'workflows');

const runCodegen = async (workspacesJson: YarnWorkspacesJson): Promise<void> => {
  // Step 1: Cleanup potentially old stale files
  if (existsSync(GITHUB_WORKFLOWS_PATH)) {
    readdirSync(GITHUB_WORKFLOWS_PATH).forEach((it) => {
      if (it.startsWith('generated-')) {
        unlinkSync(join(GITHUB_WORKFLOWS_PATH, it));
      }
    });
  }

  // Step 2: Create directory for generated workflows.
  mkdirSync(GITHUB_WORKFLOWS_PATH, { recursive: true });

  // Step 3: Write generated files.
  githubActionsCodegenService(workspacesJson).forEach(([outputFilename, outputContent]) => {
    writeFileSync(outputFilename, outputContent);
  });
};

export default runCodegen;
