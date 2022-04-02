import { expect, it } from 'mini-test';
import initialState, { root } from './initial-state';
import { changeDirectory, changeDirectoryOneLevel, peek } from './stack';

it('peek works', () => expect(peek(initialState)).toEqual(['', root]));

it('changeDirectoryOneLevel works forward and backward', () => {
  expect(changeDirectoryOneLevel(initialState, '..')).toEqual(initialState);
  const topSecretState = changeDirectoryOneLevel(initialState, 'top-secret');
  expect(changeDirectoryOneLevel(topSecretState, '..')).toEqual(initialState);
  const realSecretState = changeDirectoryOneLevel(topSecretState, 'real-secret');
  expect(changeDirectoryOneLevel(realSecretState, '..')).toEqual(topSecretState);
  const randomState = changeDirectoryOneLevel(realSecretState, 'random');
  expect(changeDirectoryOneLevel(randomState, '..')).toEqual(realSecretState);
});

it('changeDirectoryOneLevel should crash when given bad filename', () => {
  expect(() => changeDirectoryOneLevel(initialState, 'garbage')).toThrow();
  expect(() => changeDirectoryOneLevel(initialState, 'README.md')).toThrow();
});

it('changeDirectory integration test can pass', () => {
  const stateAfterComplexOperations = changeDirectory(
    changeDirectory(
      changeDirectory(
        changeDirectory(
          changeDirectory(changeDirectory(initialState, 'top-secret/real-secret/'), '../../'),
          '/top-secret/real-secret/'
        ),
        '../'
      ),
      'real-secret/random'
    ),
    '../../.././top-secret/../top-secret/../top-secret/real-secret/../'
  );
  const stateAfterSimpleOperation = changeDirectory(initialState, '/top-secret/');
  expect(stateAfterComplexOperations).toEqual(stateAfterSimpleOperation);
});
