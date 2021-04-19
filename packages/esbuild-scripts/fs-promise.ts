import {
  NoParamCallback,
  copyFile,
  lstat,
  mkdir,
  readdir,
  rm,
  rmdir,
  unlink,
  readFile as readFileCallback,
  writeFile as writeFileCallback,
} from 'fs';
import { join } from 'path';

const createNoParamCallback = (
  resolve: () => void,
  reject: (error: unknown) => void
): NoParamCallback => (error) => (error ? reject(error) : resolve());

const readDirectory = (path: string): Promise<readonly string[]> =>
  new Promise((resolve, reject) =>
    readdir(path, (error, files) => (error ? reject(error) : resolve(files)))
  );

export const copyDirectoryContent = async (
  sourceDirectory: string,
  targetDirectory: string
): Promise<void> => {
  ensureDirectory(targetDirectory);
  emptyDirectory(targetDirectory);

  await Promise.all(
    (await readDirectory(sourceDirectory)).map(async (file) => {
      const fullSourcePath = join(sourceDirectory, file);
      const fullDestinationPath = join(targetDirectory, file);
      if (await isDirectory(fullSourcePath)) {
        await copyDirectoryContent(fullSourcePath, fullDestinationPath);
      } else {
        await new Promise<void>((resolve, reject) =>
          copyFile(fullSourcePath, fullDestinationPath, createNoParamCallback(resolve, reject))
        );
      }
    })
  );
};

export const emptyDirectory = async (path: string): Promise<void> => {
  const files = await readDirectory(path);
  await Promise.all(files.map((it) => remove(join(path, it))));
};

export const ensureDirectory = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    mkdir(path, { recursive: true }, createNoParamCallback(resolve, reject))
  );

export const isDirectory = (path: string): Promise<boolean> =>
  new Promise((resolve, reject) =>
    lstat(path, (error, stats) => (error ? reject(error) : resolve(stats.isDirectory())))
  );

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
