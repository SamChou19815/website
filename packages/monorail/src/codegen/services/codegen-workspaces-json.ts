import { YARN_WORKSPACES_JSON } from '../../yarn-workspaces';
import { CodegenService } from './codegen-service-types';

const workspacesJsonCodegenService: CodegenService = {
  serviceName: 'Generate workspaces json',
  generatedCodeContentList: [
    {
      pathForGeneratedCode: 'workspaces.json',
      generatedCode: `${JSON.stringify(YARN_WORKSPACES_JSON, undefined, 2)}\n`,
    },
  ],
};

export default workspacesJsonCodegenService;
