import { statSync, lstatSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const singleSourceNeedsRebuild = (sourceFile: string, artifactTime: number) =>
  // When the source is newer than the latest built artifact, it means we need to rebuild.
  statSync(sourceFile).mtime.getTime() >= artifactTime;

const workspaceSourcesNeedRebuild = (
  workspaceLocation: string,
  excludes: readonly string[],
  artifactTime: number
): boolean => {
  const recursiveVisit = (path: string): boolean => {
    if (excludes.includes(path)) return false;
    if (lstatSync(path).isFile()) return singleSourceNeedsRebuild(path, artifactTime);
    return readdirSync(path).some((relativeChildPath) =>
      recursiveVisit(join(path, relativeChildPath))
    );
  };

  const startPath = resolve(workspaceLocation);
  return recursiveVisit(startPath);
};

export default workspaceSourcesNeedRebuild;
