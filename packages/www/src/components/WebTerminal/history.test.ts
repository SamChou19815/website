import history from './history';

it('Trivial cases return null.', () => {
  expect(history('up', [], null, null)).toBeNull();
  expect(history('down', [], null, null)).toBeNull();
  expect(history('up', [{ isCommand: false, line: '' }], null, null)).toBeNull();
  expect(history('down', [{ isCommand: false, line: '' }], null, null)).toBeNull();
});
