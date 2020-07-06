import { writeFileSync } from 'fs';

import { libraryWorkspaces } from '../../infrastructure/workspace';
import { CodegenService } from './codegen-service-types';

const staticJsonCodegenService: CodegenService = {
  serviceName: 'Generate static json',
  serviceSteps: [
    {
      stepName: 'Generate configuration/libraries.json',
      stepCode: (): void =>
        writeFileSync(
          'configuration/libraries.json',
          `${JSON.stringify(libraryWorkspaces, undefined, 2)}\n`
        ),
    },
  ],
};

export default staticJsonCodegenService;
