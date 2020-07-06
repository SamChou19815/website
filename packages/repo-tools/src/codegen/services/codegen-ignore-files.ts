import { readFileSync, writeFileSync } from 'fs';

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
  serviceSteps: [
    {
      stepName: 'Generate .eslintignore',
      stepCode: (): void => writeFileSync('.eslintignore', styleIgnoreContent),
    },
    {
      stepName: 'Generate .prettierignore',
      stepCode: (): void => writeFileSync('.prettierignore', styleIgnoreContent),
    },
  ],
};

export default ignoreFileCodegenService;
