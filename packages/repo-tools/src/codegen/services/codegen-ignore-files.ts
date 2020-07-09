import { readFileSync } from 'fs';

import { CodegenService } from './codegen-service-types';

const gitignoreContent = readFileSync('.gitignore');
const styleIgnoreAdditions = readFileSync('configuration/styleignore.additions');

const styleIgnoreContent = `# @generated

${gitignoreContent}
${styleIgnoreAdditions}`;

const ignoreFileCodegenService: CodegenService = {
  serviceName: 'Generate ignore files derived from .gitignore',
  generatedCodeContentList: [
    { pathForGeneratedCode: '.eslintignore', generatedCode: styleIgnoreContent },
    { pathForGeneratedCode: '.prettierignore', generatedCode: styleIgnoreContent },
  ],
};

export default ignoreFileCodegenService;
