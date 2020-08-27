import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import queryChangedFilesSince from 'lib-changed-files';
import type { CodegenService } from 'lib-codegen';
import { findMonorepoRoot } from 'lib-find-monorepo-root';
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

export const CodegenRealFilesystem: CodegenFilesystem = {
  fileExists: (filename) => existsSync(filename),
  readFile: (filename) => readFileSync(filename).toString(),
  writeFile: (filename, content) => {
    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, content);
  },
  deleteFile: (filename) => unlinkSync(filename),
};

export const GENERATED_FILES_SOURCE_MAPPINGS_JSON = '.codegen/mappings.json';

export const runCodegenServicesAccordingToFilesystemEvents = (
  changedSourceFiles: readonly string[],
  deletedSourceFiles: readonly string[],
  codegenServices: readonly CodegenService[],
  filesystem: CodegenFilesystem,
  shouldLog = false
): readonly string[] => {
  const log = (content: string): void => {
    // eslint-disable-next-line no-console
    if (shouldLog) console.log(content);
  };
  log('-------------------- sam-codegen --------------------');

  const generatedFileMappings: Record<string, readonly string[]> = filesystem.fileExists(
    GENERATED_FILES_SOURCE_MAPPINGS_JSON
  )
    ? JSON.parse(filesystem.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON)).mappings
    : {};

  const syntheticChangedSourceFiles = new Set(changedSourceFiles);

  const generatedToSourceMappings: Record<string, string | undefined> = {};
  Object.entries(generatedFileMappings).forEach(([source, generared]) =>
    generared.forEach((it) => {
      generatedToSourceMappings[it] = source;
    })
  );
  const treatGeneratedFilesUpdateAsSourceFileChange = (generatedFile: string): void => {
    const source = generatedToSourceMappings[generatedFile];
    if (source != null) syntheticChangedSourceFiles.add(source);
  };
  changedSourceFiles.forEach(treatGeneratedFilesUpdateAsSourceFileChange);
  deletedSourceFiles.forEach(treatGeneratedFilesUpdateAsSourceFileChange);

  const filesToDelete = new Set<string>();
  deletedSourceFiles.forEach((filename) => {
    (generatedFileMappings[filename] ?? []).forEach((managedFileToBeDeleted) => {
      if (filesystem.fileExists(managedFileToBeDeleted)) {
        filesystem.deleteFile(managedFileToBeDeleted);
        filesToDelete.add(managedFileToBeDeleted);
      }
    });
    delete generatedFileMappings[filename];
  });
  if (filesToDelete.size > 0) {
    const sorted = Array.from(filesToDelete).sort((a, b) => a.localeCompare(b));
    log(`[✓] Deleted orphan generated files: [${sorted.join(', ')}]...`);
  } else {
    log('[✓] No orphan generated files.');
  }

  const writtenFiles = new Set<string>();
  const stringComparator = (a: string, b: string) => a.localeCompare(b);

  codegenServices.forEach((service) => {
    log(`> Running ${service.name}...`);
    syntheticChangedSourceFiles.forEach((filename) => {
      if (!service.sourceFileIsRelevant(filename)) {
        return;
      }
      const source = filesystem.readFile(filename);
      const codegenOutputs = service.run(filename, source);
      const managedFiles = new Set<string>();

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

  const sortedUpdatedFiles = Array.from(writtenFiles).sort(stringComparator);
  if (sortedUpdatedFiles.length === 0) {
    log('[✓] No generated code updates.');
  } else {
    log(`[✓] Updated generated files: [${sortedUpdatedFiles.join(', ')}]...`);
  }
  return sortedUpdatedFiles;
};

export const runCodegenServicesIncrementally = async (
  codegenServices: readonly CodegenService[],
  shouldLog = false
): Promise<void> => {
  await runIncrementalTasks({
    lastestKnownGoodRunTimeFilename: join(findMonorepoRoot(), '.codegen', 'cache.json'),
    needRerun: async () => ['codegen'],
    rerun: async (_, lastestKnownGoodRunTimes) => {
      const since = lastestKnownGoodRunTimes['codegen'] ?? 0;
      const { changedFiles, deletedFiles } = await queryChangedFilesSince(since);
      runCodegenServicesAccordingToFilesystemEvents(
        changedFiles,
        deletedFiles,
        codegenServices,
        CodegenRealFilesystem,
        shouldLog
      );
      return true;
    },
  });
};
