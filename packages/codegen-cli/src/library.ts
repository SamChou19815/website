import { join } from 'path';

import queryChangedFilesSince from 'lib-changed-files';
import { CodegenFilesystem, CodegenRealFilesystem, CodegenService } from 'lib-codegen';
import { findMonorepoRoot } from 'lib-find-monorepo-root';
import runIncrementalTasks from 'lib-incremental';

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
    (generatedFileMappings[filename] ?? []).forEach((managedFileToBeDeleted) => {
      if (filesystem.fileExists(managedFileToBeDeleted)) {
        filesystem.deleteFile(managedFileToBeDeleted);
      }
    });
    delete generatedFileMappings[filename];
  });

  const writtenFiles = new Set<string>();
  const stringComparator = (a: string, b: string) => a.localeCompare(b);

  changedSourceFiles.forEach((filename) => {
    codegenServices.forEach((service) => {
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

  return Array.from(writtenFiles).sort(stringComparator);
};

export const runCodegenServicesIncrementally = async (
  codegenServices: readonly CodegenService[]
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
        CodegenRealFilesystem
      );
      return true;
    },
  });
};
