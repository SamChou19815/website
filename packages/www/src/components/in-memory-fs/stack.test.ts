import initialState, { root } from './initial-state';
import { changeDirectory, changeDirectoryOneLevel, peek } from './stack';

it('peek works', () => expect(peek(initialState)).toStrictEqual(['', root]));

it('changeDirectoryOneLevel works forward and backward', () => {
  expect(changeDirectoryOneLevel(initialState, '..')).toStrictEqual(initialState);
  const topSecretState = changeDirectoryOneLevel(initialState, 'top-secret');
  expect(changeDirectoryOneLevel(topSecretState, '..')).toStrictEqual(initialState);
  const realSecretState = changeDirectoryOneLevel(topSecretState, 'real-secret');
  expect(changeDirectoryOneLevel(realSecretState, '..')).toStrictEqual(topSecretState);
  const randomState = changeDirectoryOneLevel(realSecretState, 'random');
  expect(changeDirectoryOneLevel(randomState, '..')).toStrictEqual(realSecretState);
});

it('changeDirectoryOneLevel should crash when given bad filename', () => {
  expect(() => changeDirectoryOneLevel(initialState, 'garbage')).toThrow(
    'garbage is not found in directory: `/`.'
  );
  expect(() => changeDirectoryOneLevel(initialState, 'README.md')).toThrow(
    '`/README.md` is not a directory.'
  );
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
  expect(stateAfterComplexOperations).toStrictEqual(stateAfterSimpleOperation);
});
