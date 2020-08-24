import { join } from 'path';

import { CodegenInMemoryFilesystem } from '../codegen-filesystems';
import runCodegenServicesAccordingToFilesystemEvents, {
  GENERATED_FILES_SOURCE_MAPPINGS_JSON,
} from '../codegen-runner';
import { createPlaintextCodegenService } from '../codegen-service-factory';

it('runCodegenServicesAccordingToFilesystemEvents integration test', () => {
  const identityService = createPlaintextCodegenService('', '', (sourceFilename, sourceCode) => [
    {
      isOutputFileCodegenServiceManaged: true,
      outputRawContent: sourceCode,
      outputFilename: join('__generated__', 'managed', sourceFilename),
    },
    {
      isOutputFileCodegenServiceManaged: false,
      outputRawContent: sourceCode,
      outputFilename: join('__generated__', 'template', sourceFilename),
    },
  ]);

  const filesystem = new CodegenInMemoryFilesystem([
    [
      GENERATED_FILES_SOURCE_MAPPINGS_JSON,
      JSON.stringify({
        mappings: {
          'foo.txt': ['__generated__/managed/foo.txt', '__generated__/template/foo.txt'],
          'bar.txt': ['__generated__/managed/bar.txt', '__generated__/template/bar.txt'],
        },
      }),
    ],
    ['bar.txt', 'bar'],
    ['baz.txt', 'baz'],
    ['__generated__/managed/foo.txt', 'foo'],
    ['__generated__/template/foo.txt', 'foo'],
    ['__generated__/managed/baz.txt', 'bar'],
    ['__generated__/template/baz.txt', 'bar'],
  ]);

  const writtenFiles = runCodegenServicesAccordingToFilesystemEvents(
    ['bar.txt', 'baz.txt'],
    ['foo.txt'],
    [identityService],
    filesystem
  );

  expect(writtenFiles).toEqual([
    '__generated__/managed/bar.txt',
    '__generated__/template/bar.txt',
    '__generated__/managed/baz.txt',
  ]);
  expect(filesystem.fileExists('__generated__/managed/foo.txt')).toBe(false);
  expect(filesystem.fileExists('__generated__/template/foo.txt')).toBe(false);
  expect(filesystem.readFile('__generated__/managed/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/template/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/managed/baz.txt')).toBe('baz');
  expect(filesystem.readFile('__generated__/template/baz.txt')).toBe('bar');
});
