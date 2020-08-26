import {
  workspaceInformation,
  getYarnWorkspaceInRepoDependencyChain,
  getYarnWorkspacesInTopologicalOrder,
} from '../../infrastructure/yarn-workspace-dependency-analysis';
import { CodegenService } from './codegen-service-types';

const workspacesJsonCodegenService: CodegenService = {
  serviceName: 'Generate workspaces json',
  generatedCodeContentList: [
    {
      pathForGeneratedCode: 'workspaces.json',
      generatedCode: (() => {
        const json = {
          __type__: '@' + 'generated',
          information: Object.fromEntries(
            Array.from(workspaceInformation.entries())
              .map(
                ([workspace, information]) =>
                  [
                    workspace,
                    {
                      ...information,
                      dependencyChain: getYarnWorkspaceInRepoDependencyChain(workspace),
                    },
                  ] as const
              )
              .sort(([a], [b]) => a.localeCompare(b))
          ),
          topologicallyOrdered: getYarnWorkspacesInTopologicalOrder(),
        };
        return `${JSON.stringify(json, undefined, 2)}\n`;
      })(),
    },
  ],
};

export default workspacesJsonCodegenService;
