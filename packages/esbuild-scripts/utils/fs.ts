import { copyFile, lstat, mkdir, readdir, rm } from 'fs/promises';
import { join, relative } from 'path';

export const copyDirectoryContent = async (
  sourceDirectory: string,
  targetDirectory: string
): Promise<void> => {
  await mkdir(targetDirectory, { recursive: true });
  await Promise.all(
    (
      await readdir(targetDirectory)
    ).map((it) => rm(join(targetDirectory, it), { recursive: true, force: true }))
  );

  await Promise.all(
    (
      await readdir(sourceDirectory)
    ).map(async (file) => {
      const fullSourcePath = join(sourceDirectory, file);
      const fullDestinationPath = join(targetDirectory, file);
      if (await isDirectory(fullSourcePath)) {
        await copyDirectoryContent(fullSourcePath, fullDestinationPath);
      } else {
        await copyFile(fullSourcePath, fullDestinationPath);
      }
    })
  );
};

const isDirectory = (path: string): Promise<boolean> =>
  lstat(path).then((stats) => stats.isDirectory());

const readDirectoryRecursive = async (path: string): Promise<string[]> =>
  Promise.all(
    (await readdir(path)).flatMap(async (it) => {
      const fullPath = join(path, it);
      if (await isDirectory(fullPath)) {
        return [fullPath, ...(await readDirectoryRecursive(fullPath))];
      } else {
        return [fullPath];
      }
    })
  ).then((it) => it.flat());

export const readDirectory = async (path: string): Promise<readonly string[]> => {
  return (await readDirectoryRecursive(path))
    .map((it) => relative(path, it))
    .sort((a, b) => a.localeCompare(b));
};
