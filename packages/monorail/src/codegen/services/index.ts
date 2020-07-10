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

const executeCodegenServices = (): void => {
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

export default executeCodegenServices;
