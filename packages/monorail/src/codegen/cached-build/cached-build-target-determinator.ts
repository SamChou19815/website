import { statSync, lstatSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

import { workspaceInformation } from '../../infrastructure/yarn-workspace-dependency-analysis';

const sourceNeedRebuild = (sourceFile: string, outputLastModifiedTime: number) =>
  // When the source is newer than the latest built artifact, it means we need to rebuild.
  statSync(sourceFile).mtime.getTime() >= outputLastModifiedTime;

const sourcesNeedRebuild = (
  workspaceLocation: string,
  sources: string,
  output: string
): boolean => {
  const outputPath = join(workspaceLocation, output);
  if (!existsSync(outputPath)) {
    return true;
  }

  const outputLastModifiedTime = statSync(outputPath).mtime.getTime();
  const startPath = resolve(join(workspaceLocation, sources));

  const recursiveVisit = (path: string): boolean => {
    if (lstatSync(path).isFile()) {
      return sourceNeedRebuild(path, outputLastModifiedTime);
    }

    return readdirSync(path).some((relativeChildPath) =>
      recursiveVisit(join(path, relativeChildPath))
    );
  };

  return recursiveVisit(startPath);
};

/** @returns workspaces that need rebuild */
const cachedBuildTargetDeterminator = (): readonly string[] =>
  Array.from(workspaceInformation.entries())
    .filter(([, { workspaceLocation, codegenConfiguration }]) => {
      return (
        codegenConfiguration != null &&
        sourcesNeedRebuild(
          workspaceLocation,
          codegenConfiguration.sources,
          codegenConfiguration.output
        )
      );
    })
    .map(([name]) => name);

export default cachedBuildTargetDeterminator;
