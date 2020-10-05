import initialState from './initial-state';

it('initialState is not messed up', () => {
  expect(initialState.length).toBe(1);
  expect(initialState[0][0]).toBe('');
});
