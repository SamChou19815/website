import * as fs from "fs/promises";
import * as path from "path";

export const copyDirectoryContent = async (
  sourceDirectory: string,
  targetDirectory: string,
): Promise<void> => {
  await fs.mkdir(targetDirectory, { recursive: true });
  await Promise.all(
    (
      await fs.readdir(targetDirectory)
    ).map((it) => fs.rm(path.join(targetDirectory, it), { recursive: true, force: true })),
  );

  await Promise.all(
    (
      await fs.readdir(sourceDirectory)
    ).map(async (file) => {
      const fullSourcePath = path.join(sourceDirectory, file);
      const fullDestinationPath = path.join(targetDirectory, file);
      if (await isDirectory(fullSourcePath)) {
        await copyDirectoryContent(fullSourcePath, fullDestinationPath);
      } else {
        await fs.copyFile(fullSourcePath, fullDestinationPath);
      }
    }),
  );
};

const isDirectory = (p: string): Promise<boolean> =>
  fs.lstat(p).then((stats) => stats.isDirectory());

const readDirectoryRecursive = async (p: string): Promise<string[]> =>
  Promise.all(
    (await fs.readdir(p)).flatMap(async (it) => {
      const fullPath = path.join(p, it);
      if (await isDirectory(fullPath)) {
        return [fullPath, ...(await readDirectoryRecursive(fullPath))];
      } else {
        return [fullPath];
      }
    }),
  ).then((it) => it.flat());

export const readDirectory = async (p: string): Promise<readonly string[]> => {
  return (await readDirectoryRecursive(p))
    .map((it) => path.relative(p, it))
    .sort((a, b) => a.localeCompare(b));
};
