import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';

import githubActionsCodegenService from './codegen-github-actions';
import ignoreFileCodegenService from './codegen-ignore-files';

const codegenServices = [githubActionsCodegenService, ignoreFileCodegenService];

const executeCodegenServices = (): void => {
  codegenServices.forEach((codegenService) => {
    const { generatedFilenamePattern, generatedCodeContentList } = codegenService;
    if (generatedFilenamePattern != null) {
      spawnSync('git', ['rm', generatedFilenamePattern]);
    }
    const generatedPaths = generatedCodeContentList.map(
      ({ pathForGeneratedCode, generatedCode }) => {
        writeFileSync(pathForGeneratedCode, generatedCode);
        return pathForGeneratedCode;
      }
    );
    spawnSync('git', ['add', ...generatedPaths]);
  });
};

export default executeCodegenServices;
