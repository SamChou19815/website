export type File = TextFile | Directory;
export type TextFile = { readonly type: 'TEXT_FILE'; readonly text: string };
export type Directory = {
  readonly type: 'DIRECTORY';
  readonly children: readonly [string, File][];
};
export type DirectoryStack = readonly [string, Directory][];
export type FileSystemState = {
  readonly root: Directory;
  readonly stack: DirectoryStack;
};
