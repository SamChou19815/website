import { join } from 'path';

import {
  runCodegenServicesAccordingToFilesystemEvents,
  GENERATED_FILES_SOURCE_MAPPINGS_JSON,
} from './library';

import { CodegenInMemoryFilesystem } from 'lib-codegen';

it('runCodegenServicesAccordingToFilesystemEvents integration test', () => {
  const filesystem = new CodegenInMemoryFilesystem([
    [
      GENERATED_FILES_SOURCE_MAPPINGS_JSON,
      JSON.stringify({
        mappings: {
          'foo.txt': ['__generated__/foo.txt'],
          'bar.txt': ['__generated__/bar.txt'],
        },
      }),
    ],
    ['bar.txt', 'bar'],
    ['baz.txt', 'baz'],
    ['__generated__/foo.txt', 'foo'],
    ['__generated__/baz.txt', 'bar'],
  ]);

  const writtenFiles = runCodegenServicesAccordingToFilesystemEvents(
    ['bar.txt', 'baz.txt'],
    ['foo.txt'],
    [
      {
        name: '',
        sourceFileIsRelevant: () => true,
        run: (sourceFilename: string, sourceCode: string) => [
          {
            outputContent: sourceCode,
            outputFilename: join('__generated__', sourceFilename),
          },
        ],
      },
    ],
    filesystem
  );

  expect(writtenFiles).toEqual(['__generated__/bar.txt', '__generated__/baz.txt']);
  expect(filesystem.fileExists('__generated__/foo.txt')).toBe(false);
  expect(filesystem.readFile('__generated__/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/baz.txt')).toBe('baz');

  expect(JSON.parse(filesystem.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON))).toEqual({
    __type__: '@' + 'generated',
    mappings: {
      'bar.txt': ['__generated__/bar.txt'],
      'baz.txt': ['__generated__/baz.txt'],
    },
  });
});
