import {
  CodegenInMemoryFilesystem,
  createJsonCodegenService,
  createTypeScriptCodegenService,
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
