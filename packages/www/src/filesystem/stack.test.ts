import initialState from './initial-state';
import { changeDirectoryOneLevel, changeDirectory } from './stack';

it('changeDirectoryOneLevel works forward and backward', () => {
  expect(changeDirectoryOneLevel(initialState.stack, '..')).toStrictEqual(initialState.stack);
  const topSecretState = changeDirectoryOneLevel(initialState.stack, 'top-secret');
  expect(changeDirectoryOneLevel(topSecretState, '..')).toStrictEqual(initialState.stack);
  const realSecretState = changeDirectoryOneLevel(topSecretState, 'real-secret');
  expect(changeDirectoryOneLevel(realSecretState, '..')).toStrictEqual(topSecretState);
  const randomState = changeDirectoryOneLevel(realSecretState, 'random');
  expect(changeDirectoryOneLevel(randomState, '..')).toStrictEqual(realSecretState);
});

it('changeDirectoryOneLevel should crash when given bad filename', () => {
  expect(() => changeDirectoryOneLevel(initialState.stack, 'garbage')).toThrow(
    'garbage is not found in directory: `/`.'
  );
  expect(() => changeDirectoryOneLevel(initialState.stack, 'README.md')).toThrow(
    '`/README.md` is not a directory.'
  );
});

it('changeDirectory integration test can pass', () => {
  const stateAfterComplexOperations = changeDirectory(
    changeDirectory(
      changeDirectory(
        changeDirectory(
          changeDirectory(changeDirectory(initialState.stack, 'top-secret/real-secret/'), '../../'),
          '/top-secret/real-secret/'
        ),
        '../'
      ),
      'real-secret/random'
    ),
    '../../.././top-secret/../top-secret/../top-secret/real-secret/../'
  );
  const stateAfterSimpleOperation = changeDirectory(initialState.stack, '/top-secret/');
  expect(stateAfterComplexOperations).toStrictEqual(stateAfterSimpleOperation);
});
