#!/usr/bin/env node

/* eslint-disable no-console */
// @ts-check

const { spawnSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

/**
 * @typedef {Object} ChangedTarget
 * @property {string} name
 * @property {string} workspaceLocation
 * @property {readonly string[]} dependencyChain
 */

/** @returns {readonly ChangedTarget[]} */
const generalTargetDeterminator = () => JSON.parse(spawnSync('yarn', ['targets']).stdout);

/** @returns {boolean} */
const hasScript = (/** @type {ChangedTarget} */ target, /** @type {string} */ script) =>
  JSON.parse(readFileSync(join(target.workspaceLocation, 'package.json')).toString())?.scripts?.[
    script
  ] != null;

/** @returns {readonly string[]} */
const websitesTargetDeterminator = () =>
  generalTargetDeterminator()
    .filter((it) => hasScript(it, 'deploy'))
    .map((it) => it.name);

/** @returns {boolean} */
const runYarnScript = (/** @type {string} */ workspace, /** @type {string} */ script) =>
  spawnSync('yarn', ['workspace', workspace, script], { stdio: 'inherit' }).status === 0;

/** @returns {boolean} */
const buildAndDeploy = (/** @type {string} */ workspace) =>
  runYarnScript(workspace, 'build') && runYarnScript(workspace, 'deploy');

function main() {
  const targets = websitesTargetDeterminator();
  if (targets.length === 0) {
    console.error('No need for re-deploy!');
    return;
  }
  console.error('The following targets need to be re-deployed.');
  targets.forEach((target) => console.error(`- ${target}`));
  const results = targets.map((target) => {
    console.error();
    console.error(`Deploying ${target}`);
    return buildAndDeploy(target);
  });
  return results.every((success) => success);
}

process.exit(main() ? 0 : 1);
