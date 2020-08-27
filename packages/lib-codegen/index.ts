import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname } from 'path';

import * as TypeScript from 'typescript';

/**
 * For the purpose of deterministic testing as well potentially virtualized filesystem, we need to
 * abstract out the filesystem actions.
 */
export interface CodegenFilesystem {
  readonly fileExists: (filename: string) => boolean;
  readonly readFile: (filename: string) => string;
  readonly writeFile: (filename: string, content: string) => void;
  readonly deleteFile: (filename: string) => void;
}

export class CodegenInMemoryFilesystem implements CodegenFilesystem {
  private files: Map<string, string>;

  constructor(initialFiles: readonly (readonly [string, string])[]) {
    this.files = new Map(initialFiles);
  }

  fileExists(filename: string): boolean {
    return this.files.has(filename);
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
  fileExists: (filename) => existsSync(filename),
  readFile: (filename) => readFileSync(filename).toString(),
  writeFile: (filename, content) => {
    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, content);
  },
  deleteFile: (filename) => unlinkSync(filename),
};

export type CodegenServiceFileOutput = {
  /** Needed to output file and delete it when the source is gone */
  readonly outputFilename: string;
  /** Raw content with extra comments. The framework will handle it. */
  readonly outputContent: string;
};

export interface CodegenService {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /** Used to abandon useless codegen attempts. */
  readonly sourceFileIsRelevant: (sourceFilename: string) => boolean;
  /** The main runner code. */
  readonly run: (sourceFilename: string, source: string) => readonly CodegenServiceFileOutput[];
}

export const createJsonCodegenService = <T>(
  name: string,
  sourceFileIsRelevant: (sourceFilename: string) => boolean,
  run: (sourceFilename: string, json: T) => readonly CodegenServiceFileOutput[]
): CodegenService => ({
  name,
  sourceFileIsRelevant,
  run: (sourceFilename, source) => run(sourceFilename, JSON.parse(source)),
});

export const createTypeScriptCodegenService = <T>(
  name: string,
  sourceFileIsRelevant: (sourceFilename: string) => boolean,
  run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[]
): CodegenService => ({
  name,
  sourceFileIsRelevant,
  run: (sourceFilename, source) => {
    const transpiledModuleCode = TypeScript.transpile(source, {
      module: TypeScript.ModuleKind.CommonJS,
    });
    /*
     * TypeScript will emit code like: `exports.default = ...`. alone with other interop stuff.
     * Wrap the emitted code in an IIFE to avoid potentially pollute the global scope with eval.
     */
    const wrappedModuleCodeForEval = `((exports) => {
      ${transpiledModuleCode}

      return exports.default;
    })({})`;
    // eslint-disable-next-line no-eval
    const evaluatedSource = eval(wrappedModuleCodeForEval);
    return run(sourceFilename, evaluatedSource);
  },
});
