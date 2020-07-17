import { statSync, lstatSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const singleSourceNeedsRebuild = (sourceFile: string, artifactTime: number) =>
  // When the source is newer than the latest built artifact, it means we need to rebuild.
  statSync(sourceFile).mtime.getTime() >= artifactTime;

const workspaceSourcesNeedRebuild = (
  workspaceLocation: string,
  sources: string,
  artifactTime: number
): boolean => {
  const startPath = resolve(join(workspaceLocation, sources));

  const recursiveVisit = (path: string): boolean => {
    if (lstatSync(path).isFile()) {
      return singleSourceNeedsRebuild(path, artifactTime);
    }

    return readdirSync(path).some((relativeChildPath) =>
      recursiveVisit(join(path, relativeChildPath))
    );
  };

  return recursiveVisit(startPath);
};

export default workspaceSourcesNeedRebuild;
