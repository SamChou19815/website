import { readFileSync, unlinkSync, writeFileSync } from 'fs';

import { CodegenFilesystem } from './types';

export class CodegenInMemoryFilesystem implements CodegenFilesystem {
  private files: Map<string, string>;

  constructor(initialFiles: readonly (readonly [string, string])[]) {
    this.files = new Map(initialFiles);
  }

  readFile(filename: string): string {
    const content = this.files.get(filename);
    if (content == null) throw new Error(`No such file: ${filename}`);
    return content;
  }

  writeFile(filename: string, content: string): void {
    this.files.set(filename, content);
  }

  deleteFile(filename: string): void {
    this.files.delete(filename);
  }
}

export const CodegenRealFilesystem: CodegenFilesystem = {
  readFile: (filename) => readFileSync(filename).toString(),
  writeFile: (filename, content) => writeFileSync(filename, content),
  deleteFile: (filename) => unlinkSync(filename),
};
