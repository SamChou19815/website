import githubActionsCodegenService from './github-actions-codegen-service';

import { CodegenService } from 'lib-codegen';

const ignoreFileCodegenService: CodegenService = {
  name: 'Ignore Files Codegen',
  sourceFileIsRelevant: (sourceFilename) => sourceFilename === '.gitignore',
  run: (_, gitignoreContent) => {
    const styleIgnoreContent = `# @${'generated'}

${gitignoreContent}
# additions
.yarn
**/bin/
**/out/
**/build/
**/dist/
`;

    return [
      { outputFilename: '.eslintignore', outputContent: styleIgnoreContent },
      { outputFilename: '.prettierignore', outputContent: styleIgnoreContent },
    ];
  },
};

const codegenServices: readonly CodegenService[] = [
  githubActionsCodegenService,
  ignoreFileCodegenService,
];

export = codegenServices;
