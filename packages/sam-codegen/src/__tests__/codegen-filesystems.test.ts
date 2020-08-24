import { CodegenInMemoryFilesystem } from '../codegen-filesystems';

it('CodegenInMemoryFilesystem works.', () => {
  const filesystem = new CodegenInMemoryFilesystem([['foo.txt', 'bar']]);
  expect(filesystem.readFile('foo.txt')).toBe('bar');
  expect(() => filesystem.readFile('bar.txt')).toThrow();
  filesystem.writeFile('bar.txt', 'baz');
  expect(filesystem.readFile('bar.txt')).toBe('baz');
  filesystem.deleteFile('foo.txt');
  expect(() => filesystem.readFile('foo.txt')).toThrow();
});
