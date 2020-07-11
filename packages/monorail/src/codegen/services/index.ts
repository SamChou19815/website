import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';

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

const executeWorkspaceDefinedCodegenServices = () => {};

const executeCodegenServices = (): void => {
  executePredefinedCodegenServices();
  executeWorkspaceDefinedCodegenServices();
};

export default executeCodegenServices;
