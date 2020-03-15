// @ts-check

const { execSync } = require('child_process');

/**
 * @type {Map<string, readonly string[]>}
 */
const workspaceInformation = (() => {
  /**
   * @type {Map<string, readonly string[]>}
   */
  const map = new Map();
  let output = execSync('yarn workspaces info --silent')
    .toString()
    .trim();
  if (output.startsWith('yarn workspaces')) {
    const lines = output.split('\n');
    output = lines.slice(1, lines.length - 1).join('\n');
  }
  const workspacesJson = JSON.parse(output);
  Object.entries(workspacesJson).forEach(([workspaceName, object]) => {
    map.set(workspaceName, object.workspaceDependencies);
  });
  return map;
})();

/**
 * @type {readonly string[]}
 */
const projectWorkspaces = Array.from(workspaceInformation.keys()).filter(
  workspace => !workspace.startsWith('lib-')
);

/**
 * @param {string} workspace
 * @returns {readonly string[]}
 */
const getWorkspaceDependencies = workspace => {
  const information = workspaceInformation.get(workspace);
  if (information == null) {
    throw new Error(`Workspace ${workspace} is not found!`);
  }
  return information;
};

/**
 *
 * @param {string} workspace
 * @returns {readonly string[]}
 */
const getDependencyChain = workspace => {
  /**
   * @type {string[]}
   */
  const dependencyChain = [];
  /**
   * @type {string[]}
   */
  const parentChain = [];
  /**
   * @type {Set<string>}
   */
  const parentSet = new Set();
  /**
   * @type {Set<string>}
   */
  const allVisited = new Set();

  /**
   * @param {string} node
   * @returns {void}
   */
  const visit = node => {
    // Check cyclic dependencies.
    if (allVisited.has(node)) {
      if (!parentSet.has(node)) {
        // We reach the end of the chain because we have visited it before.
        return;
      }
      parentChain.push(node);
      const firstIndex = parentChain.indexOf(node);
      const cyclicDependencyChain = parentChain.slice(firstIndex, parentChain.length).join(' -> ');
      throw new Error(`Cyclic dependency detected: ${cyclicDependencyChain}`);
    }

    // Check dependencies.
    const workspaceDependencies = getWorkspaceDependencies(node);

    // Visit dependencies
    allVisited.add(node);
    parentChain.push(node);
    parentSet.add(node);
    workspaceDependencies.forEach(visit);
    parentSet.delete(node);
    parentChain.pop();
    dependencyChain.push(node);
  };

  visit(workspace);
  return dependencyChain;
};

/**
 * @throws if there is a cyclic dependency chain.
 */
const validateDependencyChain = () =>
  Array.from(workspaceInformation.keys()).forEach(workspace => {
    getDependencyChain(workspace);
    // eslint-disable-next-line no-console
    console.log(`No cyclic dependency detected with ${workspace} as root.`);
  });

module.exports = { projectWorkspaces, getDependencyChain, validateDependencyChain };
