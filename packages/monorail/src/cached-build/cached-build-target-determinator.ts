import { statSync, existsSync } from 'fs';
import { join } from 'path';

import workspaceSourcesNeedRebuild from '../infrastructure/need-rebuild-checker';
import { workspaceInformation } from '../infrastructure/yarn-workspace-dependency-analysis';

const sourcesNeedRebuild = (
  workspaceLocation: string,
  sources: string,
  output: string
): boolean => {
  const outputPath = join(workspaceLocation, output);
  return workspaceSourcesNeedRebuild(
    workspaceLocation,
    sources,
    existsSync(outputPath) ? statSync(outputPath).mtime.getTime() : 0
  );
};

/** @returns workspaces that need rebuild */
const cachedBuildTargetDeterminator = (): readonly string[] =>
  Array.from(workspaceInformation.entries())
    .filter(([, { workspaceLocation, codegenConfiguration }]) => {
      return (
        codegenConfiguration != null &&
        codegenConfiguration.sources.some((sourceSet) =>
          sourcesNeedRebuild(workspaceLocation, sourceSet, codegenConfiguration.output)
        )
      );
    })
    .map(([name]) => name);

export default cachedBuildTargetDeterminator;
