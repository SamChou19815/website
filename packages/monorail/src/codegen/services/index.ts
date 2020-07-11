import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';

import { workspaceInformation } from '../../infrastructure/yarn-workspace-dependency-analysis';
import githubActionsCodegenService from './codegen-github-actions';
import ignoreFileCodegenService from './codegen-ignore-files';
import staticJsonCodegenService from './codegen-json';

const codegenServices = [
  githubActionsCodegenService,
  ignoreFileCodegenService,
  staticJsonCodegenService,
];

const executePredefinedCodegenServices = () => {
  codegenServices.forEach((codegenService) => {
    const { generatedFilenamePattern, generatedCodeContentList } = codegenService;
    if (generatedFilenamePattern != null) {
      spawnSync('rm', [generatedFilenamePattern], { shell: true });
    }
    generatedCodeContentList.forEach(({ pathForGeneratedCode, generatedCode }) =>
      writeFileSync(pathForGeneratedCode, generatedCode)
    );
  });
};

const executeWorkspaceDefinedCodegenServices = () => {
  workspaceInformation.forEach(({ codegenConfiguration }, workspaceName) => {
    // TODO replace this when the implementation is ready.
    // eslint-disable-next-line no-console
    console.log(workspaceName, codegenConfiguration);
  });
};

const executeCodegenServices = (): void => {
  executePredefinedCodegenServices();
  executeWorkspaceDefinedCodegenServices();
};

export default executeCodegenServices;
