import { stripRoot, normalize, join, currentStackDirectoryPath } from './path';
import initialState from './initial-state';
import { changeDirectoryOneLevel } from './stack';

it('stripRoot works', () => {
  expect(stripRoot('/foo')).toBe('foo');
  expect(stripRoot('/foo/bar')).toBe('foo/bar');
  expect(stripRoot('foo')).toBe('foo');
  expect(stripRoot('foo/bar')).toBe('foo/bar');
});

it('normalize works', () => {
  expect(normalize('foo')).toBe('foo');
  expect(normalize('foo/bar')).toBe('foo/bar');
  expect(normalize('foo/')).toBe('foo');
  expect(normalize('foo/bar/')).toBe('foo/bar');
});

it('join works', () => {
  expect(join('foo', 'bar')).toBe('foo/bar');
  expect(join('/', 'bar')).toBe('/bar');
  expect(join('foo/', 'bar')).toBe('foo/bar');
  expect(join('foo/', '/bar')).toBe('/bar');
  expect(join('foo/', '/bar/')).toBe('/bar');
  expect(join('/foo/', 'bar')).toBe('/foo/bar');
});

it('currentDirectoryPath works', () => {
  expect(currentStackDirectoryPath(initialState.stack)).toBe('/');
  const topSecretStack = changeDirectoryOneLevel(initialState.stack, 'top-secret');
  expect(currentStackDirectoryPath(topSecretStack)).toBe('/top-secret');
  const realSecretStack = changeDirectoryOneLevel(topSecretStack, 'real-secret');
  expect(currentStackDirectoryPath(realSecretStack)).toBe('/top-secret/real-secret');
  const randomStack = changeDirectoryOneLevel(realSecretStack, 'random');
  expect(currentStackDirectoryPath(randomStack)).toBe('/top-secret/real-secret/random');
});
