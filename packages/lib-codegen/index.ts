import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

import * as TypeScript from 'typescript';

import queryChangedFilesSince from 'lib-changed-files';
import runIncrementalTasks from 'lib-incremental';

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

export interface CodegenService {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /** The main runner code. */
  readonly run: (sourceFilename: string, source: string) => readonly CodegenServiceFileOutput[];
}

export const createPlaintextConcatenationCodegenService = (
  name: string,
  additionalContentsToConcatenate: readonly {
    readonly additionalContent: string;
    readonly outputFilename: string;
  }[]
): CodegenService => ({
  name,
  run: (_, source) =>
    additionalContentsToConcatenate.map(({ additionalContent, outputFilename }) => ({
      outputContent: `${source}${additionalContent}`,
      outputFilename,
    })),
});

export const createJsonCodegenService = <T>(
  name: string,
  run: (sourceFilename: string, json: T) => readonly CodegenServiceFileOutput[]
): CodegenService => ({
  name,
  run: (sourceFilename, source) => run(sourceFilename, JSON.parse(source)),
});

export const createTypeScriptCodegenService = <T>(
  name: string,
  run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[]
): CodegenService => ({
  name,
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

export const GENERATED_FILES_SOURCE_MAPPINGS_JSON = '.codegen/mappings.json';

export const runCodegenServicesAccordingToFilesystemEvents = (
  changedSourceFiles: readonly string[],
  deletedSourceFiles: readonly string[],
  codegenServices: readonly CodegenService[],
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
      const codegenOutputs = service.run(filename, source);
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
  lastestKnownGoodRunTimeFilename: string,
  codegenServices: readonly CodegenService[]
): Promise<void> => {
  await runIncrementalTasks({
    lastestKnownGoodRunTimeFilename,
    needRerun: async () => ['codegen'],
    rerun: async (_, lastestKnownGoodRunTimes) => {
      const since = lastestKnownGoodRunTimes['codegen'] ?? 0;
      const { changedFiles, deletedFiles } = await queryChangedFilesSince(since);
      runCodegenServicesAccordingToFilesystemEvents(
        changedFiles,
        deletedFiles,
        codegenServices,
        CodegenRealFilesystem
      );
      return true;
    },
  });
};
