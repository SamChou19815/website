import { statSync, lstatSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import {
  getYarnWorkspaceInRepoDependencyChain,
  getYarnWorkspaceLocation,
} from './yarn-workspace-dependency-analysis';

const singleSourceNeedsRebuild = (sourceFile: string, artifactTime: number) =>
  // When the source is newer than the latest built artifact, it means we need to rebuild.
  statSync(sourceFile).mtime.getTime() >= artifactTime;

const singleWorkspaceSourcesNeedRebuild = (
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

const workspaceNeedRebuild = (
  workspaceName: string,
  excludes: readonly string[],
  artifactTime: number
): boolean =>
  getYarnWorkspaceInRepoDependencyChain(workspaceName)
    .map(getYarnWorkspaceLocation)
    .some((location) => singleWorkspaceSourcesNeedRebuild(location, excludes, artifactTime));

export default workspaceNeedRebuild;
