import {
  NoParamCallback,
  access,
  lstat,
  mkdir,
  readdir,
  rm,
  rmdir,
  unlink,
  copyFile as copyFileCallback,
  readFile as readFileCallback,
  writeFile as writeFileCallback,
} from 'fs';
import { join, relative } from 'path';

const createNoParamCallback =
  (resolve: () => void, reject: (error: unknown) => void): NoParamCallback =>
  (error) =>
    error ? reject(error) : resolve();

const readDirectoryPrimitive = (path: string): Promise<string[]> =>
  new Promise((resolve, reject) =>
    readdir(path, (error, files) => (error ? reject(error) : resolve(files)))
  );

const readDirectoryRecursive = async (path: string): Promise<string[]> =>
  Promise.all(
    (await readDirectoryPrimitive(path)).flatMap(async (it) => {
      const fullPath = join(path, it);
      if (await isDirectory(fullPath)) {
        return [fullPath, ...(await readDirectoryRecursive(fullPath))];
      } else {
        return [fullPath];
      }
    })
  ).then((it) => it.flat());

export const copyDirectoryContent = async (
  sourceDirectory: string,
  targetDirectory: string
): Promise<void> => {
  await ensureDirectory(targetDirectory);
  await emptyDirectory(targetDirectory);

  await Promise.all(
    (
      await readDirectoryPrimitive(sourceDirectory)
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

export const copyFile = (sourceFile: string, destinationFile: string): Promise<void> =>
  new Promise((resolve, reject) =>
    copyFileCallback(sourceFile, destinationFile, createNoParamCallback(resolve, reject))
  );

export const emptyDirectory = async (path: string): Promise<void> => {
  const files = await readDirectoryPrimitive(path);
  await Promise.all(files.map((it) => remove(join(path, it))));
};

export const ensureDirectory = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    mkdir(path, { recursive: true }, createNoParamCallback(resolve, reject))
  );

export const exists = (path: string): Promise<boolean> =>
  new Promise((resolve) => access(path, undefined, (e) => resolve(e == null)));

export const isDirectory = (path: string): Promise<boolean> =>
  new Promise((resolve, reject) =>
    lstat(path, (error, stats) => (error ? reject(error) : resolve(stats.isDirectory())))
  );

export const readDirectory = async (
  path: string,
  recursive: boolean
): Promise<readonly string[]> => {
  if (!recursive) return readDirectoryPrimitive(path);
  if (!(await exists(path))) return [];
  return (await readDirectoryRecursive(path))
    .map((it) => relative(path, it))
    .sort((a, b) => a.localeCompare(b));
};

export const readFile = (path: string): Promise<string> =>
  new Promise((resolve, reject) =>
    readFileCallback(path, (error, data) => (error ? reject(error) : resolve(data.toString())))
  );

export const remove = (path: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (readFileCallback != null) {
      rm(path, { recursive: true, force: true }, createNoParamCallback(resolve, reject));
    } else {
      isDirectory(path)
        .then((isDir) =>
          isDir
            ? rmdir(path, { recursive: true }, createNoParamCallback(resolve, reject))
            : unlink(path, createNoParamCallback(resolve, reject))
        )
        .catch((error) => reject(error));
    }
  });

export const writeFile = (path: string, content: string | NodeJS.ArrayBufferView): Promise<void> =>
  new Promise((resolve, reject) =>
    writeFileCallback(path, content, createNoParamCallback(resolve, reject))
  );
