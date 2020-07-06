/* eslint-disable no-console */

import githubActionsCodegenService from './codegen-github-actions';
import ignoreFileCodegenService from './codegen-ignore-files';
import staticJsonCodegenService from './codegen-json';

const codegenServices = [
  githubActionsCodegenService,
  ignoreFileCodegenService,
  staticJsonCodegenService,
];

const executeCodegenServices = (): void => {
  console.log('@dev-sam/repo-tools codegen service.\n');
  codegenServices.forEach(({ serviceName, serviceSteps }) => {
    console.group(serviceName);
    serviceSteps.forEach(({ stepName, stepCode }, index) => {
      console.groupCollapsed(`${index + 1}. ${stepName}`);
      stepCode();
      console.groupEnd();
    });
    console.groupEnd();
  });
};

export default executeCodegenServices;
