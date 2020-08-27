import { readFileSync } from 'fs';

import { CodegenService } from './codegen-service-types';

const styleIgnoreContent = `# ${'@' + 'generated'}

${readFileSync('.gitignore')}

# additions
.yarn
**/bin/`;

const ignoreFileCodegenService: CodegenService = {
  serviceName: 'Generate ignore files derived from .gitignore',
  generatedCodeContentList: [
    { pathForGeneratedCode: '.eslintignore', generatedCode: styleIgnoreContent },
    { pathForGeneratedCode: '.prettierignore', generatedCode: styleIgnoreContent },
  ],
};

export default ignoreFileCodegenService;
