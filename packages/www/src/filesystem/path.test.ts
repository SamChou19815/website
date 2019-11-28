import { stripRoot, normalize, join, currentDirectoryPath } from './path';
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
  expect(currentDirectoryPath(initialState)).toBe('/');
  const topSecretState = changeDirectoryOneLevel(initialState, 'top-secret');
  expect(currentDirectoryPath(topSecretState)).toBe('/top-secret');
  const realSecretState = changeDirectoryOneLevel(topSecretState, 'real-secret');
  expect(currentDirectoryPath(realSecretState)).toBe('/top-secret/real-secret');
  const randomState = changeDirectoryOneLevel(realSecretState, 'random');
  expect(currentDirectoryPath(randomState)).toBe('/top-secret/real-secret/random');
});
