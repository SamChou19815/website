import { statSync, existsSync } from 'fs';
import { join, resolve } from 'path';

import workspaceNeedRebuild from '../infrastructure/need-rebuild-checker';
import { workspaceInformation } from '../infrastructure/yarn-workspace-dependency-analysis';

const sourcesNeedRebuild = (
  workspaceName: string,
  workspaceLocation: string,
  output: string
): boolean => {
  const outputPath = resolve(join(workspaceLocation, output));
  return workspaceNeedRebuild(
    workspaceName,
    [outputPath],
    existsSync(outputPath) ? statSync(outputPath).mtime.getTime() : 0
  );
};

/** @returns workspaces that need rebuild */
const cachedBuildTargetDeterminator = (): readonly string[] =>
  Array.from(workspaceInformation.entries())
    .filter(([workspaceName, { workspaceLocation, codegenConfiguration }]) => {
      return (
        codegenConfiguration != null &&
        sourcesNeedRebuild(workspaceName, workspaceLocation, codegenConfiguration.output)
      );
    })
    .map(([name]) => name);

export default cachedBuildTargetDeterminator;
