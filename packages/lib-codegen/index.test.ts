import { join } from 'path';

import {
  CodegenInMemoryFilesystem,
  createJsonCodegenService,
  createTypeScriptCodegenService,
  runCodegenServicesAccordingToFilesystemEvents,
  GENERATED_FILES_SOURCE_MAPPINGS_JSON,
} from '.';

it('CodegenInMemoryFilesystem works.', () => {
  const filesystem = new CodegenInMemoryFilesystem([['foo.txt', 'bar']]);
  expect(filesystem.readFile('foo.txt')).toBe('bar');
  expect(() => filesystem.readFile('bar.txt')).toThrow();
  filesystem.writeFile('bar.txt', 'baz');
  expect(filesystem.readFile('bar.txt')).toBe('baz');
  filesystem.deleteFile('foo.txt');
  expect(() => filesystem.readFile('foo.txt')).toThrow();
});

it('createJsonCodegenService works', () => {
  const service = createJsonCodegenService<{ foo: string }>(
    '',
    () => true,
    (_, json) => [{ outputFilename: '', outputContent: json.foo }]
  );
  expect(service.run('', '{"foo":"bar"}')[0].outputContent).toBe('bar');
});

it('createTypeScriptCodegenService works', () => {
  const service = createTypeScriptCodegenService<() => number>(
    '',
    () => true,
    (_, f) => [{ outputFilename: '', outputContent: String(f()) }]
  );

  // Test that
  // - type imports are fully erased.
  // - exports can be fully evaluated even if it's a function.
  expect(
    service.run('', 'import type {Foo} from "bar"; export default () => 42')[0].outputContent
  ).toBe('42');
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
      {
        name: '',
        sourceFileIsRelevant: () => true,
        run: (sourceFilename) =>
          sourceFilename === 'bar.txt'
            ? [
                {
                  outputContent: 'special',
                  outputFilename: join('__generated__', 'very-special'),
                },
              ]
            : [],
      },
    ],
    filesystem
  );

  expect(writtenFiles).toEqual([
    '__generated__/bar.txt',
    '__generated__/baz.txt',
    '__generated__/very-special',
  ]);
  expect(filesystem.fileExists('__generated__/foo.txt')).toBe(false);
  expect(filesystem.readFile('__generated__/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/baz.txt')).toBe('baz');
  expect(filesystem.readFile('__generated__/very-special')).toBe('special');

  expect(JSON.parse(filesystem.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON))).toEqual({
    __type__: '@' + 'generated',
    mappings: {
      'bar.txt': ['__generated__/bar.txt', '__generated__/very-special'],
      'baz.txt': ['__generated__/baz.txt'],
    },
  });
});
