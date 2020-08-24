import { CodegenFilesystem, CodegenService } from './types';

export const GENERATED_FILES_SOURCE_MAPPINGS_JSON = '.codegen/mappings.json';

const runCodegenServicesAccordingToFilesystemEvents = (
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
    generatedFileMappings[filename].forEach((managedFileToBeDeleted) =>
      filesystem.deleteFile(managedFileToBeDeleted)
    );
    delete generatedFileMappings[filename];
  });

  const writtenFiles: string[] = [];

  changedSourceFiles.forEach((filename) => {
    const source = filesystem.readFile(filename);
    codegenServices.forEach((service) => {
      const codegenOutputs = service.run(filename, service.generatedSourceEvaluator(source));
      const managedFiles: string[] = [];

      codegenOutputs.forEach(
        ({ isOutputFileCodegenServiceManaged, outputFilename, outputRawContent }) => {
          if (isOutputFileCodegenServiceManaged || !filesystem.fileExists(outputFilename)) {
            filesystem.writeFile(outputFilename, outputRawContent);
            writtenFiles.push(outputFilename);
          }
          if (isOutputFileCodegenServiceManaged) {
            managedFiles.push(outputFilename);
          }
        }
      );

      generatedFileMappings[filename] = managedFiles.sort((a, b) => a.localeCompare(b));
    });
  });

  filesystem.writeFile(
    GENERATED_FILES_SOURCE_MAPPINGS_JSON,
    JSON.stringify(
      {
        __type__: '@' + 'generated',
        mappings: Object.fromEntries(
          Object.entries(generatedFileMappings).sort(([k1], [k2]) => k1.localeCompare(k2))
        ),
      },
      undefined,
      2
    )
  );

  return writtenFiles;
};

export default runCodegenServicesAccordingToFilesystemEvents;
