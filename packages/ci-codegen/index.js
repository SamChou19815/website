#!/usr/bin/env node

// @ts-check

const {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} = require('fs');
const { join } = require('path');

/**
 * @typedef {Object} YarnInvididualWorkspaceInformation
 * @property {string} workspaceLocation
 * @property {readonly string[]} dependencyChain
 */

/**
 * @typedef {Object} YarnWorkspacesJson
 * @property {Readonly<Record<string, YarnInvididualWorkspaceInformation>>} information
 * @property {readonly string[]} topologicallyOrdered
 */

/** @type {string} */
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

/** @returns {boolean} */
const hasScript = (
  /** @type {YarnWorkspacesJson} */ workspacesJson,
  /** @type {string} */ workspace,
  /** @type {string} */ script
) => {
  const oneWorkspace = workspacesJson.information[workspace];
  if (oneWorkspace == null) throw new Error();
  return (
    JSON.parse(readFileSync(join(oneWorkspace.workspaceLocation, 'package.json')).toString())
      ?.scripts?.[script] != null
  );
};

/** @returns {readonly (readonly [name: string, content: string])[]} */
const githubActionsCodegenService = (/** @type {YarnWorkspacesJson} */ workspacesJson) =>
  workspacesJson.topologicallyOrdered
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
        (workspaceDependency) =>
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
      ];
    });

const GITHUB_WORKFLOWS_PATH = join('.github', 'workflows');

const runCodegen = async (/** @type {YarnWorkspacesJson} */ workspacesJson) => {
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

runCodegen(JSON.parse(readFileSync(join(__dirname, '..', '..', 'workspaces.json')).toString()));
