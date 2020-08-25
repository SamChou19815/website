import { join } from 'path';

import {
  CodegenInMemoryFilesystem,
  createPlaintextCodegenService,
  createPlaintextConcatenationCodegenService,
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

it('createPlaintextConcatenationCodegenService works', () => {
  const service = createPlaintextConcatenationCodegenService('', '', [
    { additionalContent: 'foo', outputFilename: 'foo.sam' },
    { additionalContent: 'bar', outputFilename: 'bar.sam' },
  ]);

  expect(service.run('', 'haha-')).toEqual([
    {
      isOutputFileCodegenServiceManaged: true,
      outputFilename: 'foo.sam',
      outputRawContent: 'haha-foo',
    },
    {
      isOutputFileCodegenServiceManaged: true,
      outputFilename: 'bar.sam',
      outputRawContent: 'haha-bar',
    },
  ]);
});

it('createTypeScriptCodegenService works', () => {
  const service = createTypeScriptCodegenService<() => number>('', '', () => []);

  // Test that
  // - type imports are fully erased.
  // - exports can be fully evaluated even if it's a function.
  expect(
    service.generatedSourceEvaluator('import type {Foo} from "bar"; export default () => 42')()
  ).toBe(42);
});

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
  const barTxtOnlyService = createPlaintextCodegenService('', '', (sourceFilename) =>
    sourceFilename === 'bar.txt'
      ? [
          {
            isOutputFileCodegenServiceManaged: true,
            outputRawContent: 'special',
            outputFilename: join('__generated__', 'managed', 'very-special'),
          },
        ]
      : []
  );

  const filesystem = new CodegenInMemoryFilesystem([
    [
      GENERATED_FILES_SOURCE_MAPPINGS_JSON,
      JSON.stringify({
        mappings: {
          'foo.txt': ['__generated__/managed/foo.txt'],
          'bar.txt': ['__generated__/managed/bar.txt'],
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
    [identityService, barTxtOnlyService],
    filesystem
  );

  expect(writtenFiles).toEqual([
    '__generated__/managed/bar.txt',
    '__generated__/managed/baz.txt',
    '__generated__/managed/very-special',
    '__generated__/template/bar.txt',
  ]);
  expect(filesystem.fileExists('__generated__/managed/foo.txt')).toBe(false);
  expect(filesystem.fileExists('__generated__/template/foo.txt')).toBe(true);
  expect(filesystem.readFile('__generated__/managed/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/template/bar.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/managed/baz.txt')).toBe('baz');
  expect(filesystem.readFile('__generated__/template/baz.txt')).toBe('bar');
  expect(filesystem.readFile('__generated__/managed/very-special')).toBe('special');

  expect(JSON.parse(filesystem.readFile(GENERATED_FILES_SOURCE_MAPPINGS_JSON))).toEqual({
    __type__: '@' + 'generated',
    mappings: {
      'bar.txt': ['__generated__/managed/bar.txt', '__generated__/managed/very-special'],
      'baz.txt': ['__generated__/managed/baz.txt'],
    },
  });
});
