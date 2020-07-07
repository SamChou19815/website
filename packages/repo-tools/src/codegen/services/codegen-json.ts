import { libraryWorkspaces } from '../../infrastructure/workspace';
import { CodegenService } from './codegen-service-types';

const staticJsonCodegenService: CodegenService = {
  serviceName: 'Generate static json',
  generatedCodeContentList: [
    {
      pathForGeneratedCode: 'configuration/libraries.json',
      generatedCode: `${JSON.stringify(libraryWorkspaces, undefined, 2)}\n`,
    },
  ],
};

export default staticJsonCodegenService;
