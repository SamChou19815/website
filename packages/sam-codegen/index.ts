import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

import * as TypeScript from 'typescript';

import queryChangedFilesFromDevSamWatcherServerSince from 'lib-changed-files';

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
  writeFile: (filename, content) => writeFileSync(filename, content),
  deleteFile: (filename) => unlinkSync(filename),
};

export type CodegenServiceFileOutput = {
  /** Needed to output file and delete it when the source is gone */
  readonly outputFilename: string;
  /** Raw content with extra comments. The framework will handle it. */
  readonly outputContent: string;
};

export interface CodegenService<T> {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /**
   * The raw source to be evaluated to an arbritrary JS object.
   * The implementation can be as simple as the identity function.
   * This is needed to ensure that we can run arbitrary JS code to get the information necessary for
   * codegen instead of parsing everything statically.
   */
  readonly generatedSourceEvaluator: (sourceString: string) => T;
  /** The main runner code. */
  readonly run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[];
}

export const createPlaintextCodegenService = (
  name: string,
  run: (sourceFilename: string, evaluatedSource: string) => readonly CodegenServiceFileOutput[]
): CodegenService<string> => ({
  name,
  generatedSourceEvaluator: (sourceString) => sourceString,
  run,
});

export const createPlaintextConcatenationCodegenService = (
  name: string,
  additionalContentsToConcatenate: readonly {
    readonly additionalContent: string;
    readonly outputFilename: string;
  }[]
): CodegenService<string> =>
  createPlaintextCodegenService(name, (_, evaluatedSource) =>
    additionalContentsToConcatenate.map(({ additionalContent, outputFilename }) => ({
      outputContent: `${evaluatedSource}${additionalContent}`,
      outputFilename,
    }))
  );

export const createTypeScriptCodegenService = <T>(
  name: string,
  run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[]
): CodegenService<T> => ({
  name,
  generatedSourceEvaluator: (sourceString) => {
    const transpiledModuleCode = TypeScript.transpile(sourceString, {
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
    return eval(wrappedModuleCodeForEval);
  },
  run,
});

export const GENERATED_FILES_SOURCE_MAPPINGS_JSON = '.codegen/mappings.json';

export const runCodegenServicesAccordingToFilesystemEvents = (
  changedSourceFiles: readonly string[],
  deletedSourceFiles: readonly string[],
  // Need the any type to overcome covariance and contravariance issue :(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codegenServices: readonly CodegenService<any>[],
  filesystem: CodegenFilesystem
): readonly string[] => {
  const generatedFileMappings: Record<string, readonly string[]> = filesystem.fileExists(
    GENERATED_FILES_SOURCE_MAPPINGS_JSON
  )
    ? JSON.parse(filesystem.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON)).mappings
    : {};

  deletedSourceFiles.forEach((filename) => {
    generatedFileMappings[filename].forEach((managedFileToBeDeleted) => {
      if (filesystem.fileExists(managedFileToBeDeleted)) {
        filesystem.deleteFile(managedFileToBeDeleted);
      }
    });
    delete generatedFileMappings[filename];
  });

  const writtenFiles = new Set<string>();
  const stringComparator = (a: string, b: string) => a.localeCompare(b);

  changedSourceFiles.forEach((filename) => {
    const source = filesystem.readFile(filename);
    codegenServices.forEach((service) => {
      const codegenOutputs = service.run(filename, service.generatedSourceEvaluator(source));
      const managedFiles = new Set(generatedFileMappings[filename] ?? []);

      codegenOutputs.forEach(({ outputFilename, outputContent }) => {
        filesystem.writeFile(outputFilename, outputContent);
        writtenFiles.add(outputFilename);
        managedFiles.add(outputFilename);
      });

      generatedFileMappings[filename] = Array.from(managedFiles).sort(stringComparator);
    });
  });

  filesystem.writeFile(
    GENERATED_FILES_SOURCE_MAPPINGS_JSON,
    JSON.stringify(
      {
        __type__: '@' + 'generated',
        mappings: Object.fromEntries(
          Object.entries(generatedFileMappings).sort(([k1], [k2]) => stringComparator(k1, k2))
        ),
      },
      undefined,
      2
    )
  );

  return Array.from(writtenFiles).sort(stringComparator);
};

export const runCodegenServicesIncrementally = async (
  since: number,
  // Need the any type to overcome covariance and contravariance issue :(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codegenServices: readonly CodegenService<any>[]
): Promise<void> => {
  const events = await queryChangedFilesFromDevSamWatcherServerSince(since);
  const changedSourceFiles: string[] = [];
  const deletedSourceFiles: string[] = [];
  events.forEach(({ type, filename }) => {
    if (type === 'changed') {
      changedSourceFiles.push(filename);
    } else {
      deletedSourceFiles.push(filename);
    }
  });

  runCodegenServicesAccordingToFilesystemEvents(
    changedSourceFiles,
    deletedSourceFiles,
    codegenServices,
    CodegenRealFilesystem
  );
};
