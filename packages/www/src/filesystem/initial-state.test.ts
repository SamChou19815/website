import initialState from './initial-state';

it('initialState is not messed up', () => {
  expect(initialState.stack.length).toBe(1);
  expect(initialState.stack[0][0]).toBe('');
});
