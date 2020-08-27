import { join } from 'path';

import {
  CodegenFilesystem,
  runCodegenServicesAccordingToFilesystemEvents,
  GENERATED_FILES_SOURCE_MAPPINGS_JSON,
} from './library';

class CodegenInMemoryFilesystem implements CodegenFilesystem {
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

it('CodegenInMemoryFilesystem works.', () => {
  const filesystem = new CodegenInMemoryFilesystem([['foo.txt', 'bar']]);
  expect(filesystem.readFile('foo.txt')).toBe('bar');
  expect(() => filesystem.readFile('bar.txt')).toThrow();
  filesystem.writeFile('bar.txt', 'baz');
  expect(filesystem.readFile('bar.txt')).toBe('baz');
  filesystem.deleteFile('foo.txt');
  expect(() => filesystem.readFile('foo.txt')).toThrow();
});

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
