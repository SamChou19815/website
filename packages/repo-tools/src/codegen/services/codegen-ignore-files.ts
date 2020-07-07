import { readFileSync } from 'fs';

import { CodegenService } from './codegen-service-types';

const gitignoreContent = readFileSync('.gitignore');

const styleIgnoreContent = `# @generated

${gitignoreContent}
# styles

.yarn
packages/lib-docusaurus-plugin/index.js
packages/repo-tools/bin/
`;

const ignoreFileCodegenService: CodegenService = {
  serviceName: 'Generate ignore files derived from .gitignore',
  generatedCodeContentList: [
    { pathForGeneratedCode: '.eslintignore', generatedCode: styleIgnoreContent },
    { pathForGeneratedCode: '.prettierignore', generatedCode: styleIgnoreContent },
  ],
};

export default ignoreFileCodegenService;
