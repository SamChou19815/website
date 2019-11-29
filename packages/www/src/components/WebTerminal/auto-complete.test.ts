import autoComplete, { autoCompleteOnePart } from './auto-complete';

it('autoCompleteOnePart works', () => {
  // One choice cases
  expect(autoCompleteOnePart(['foo', 'bar'], 'f')).toBe('foo');
  expect(autoCompleteOnePart(['foo', 'bar'], 'fo')).toBe('foo');
  expect(autoCompleteOnePart(['foo', 'bar'], 'foo')).toBe('foo');
  expect(autoCompleteOnePart(['foo', 'bar'], 'b')).toBe('bar');
  expect(autoCompleteOnePart(['foo', 'bar'], 'ba')).toBe('bar');
  expect(autoCompleteOnePart(['foo', 'bar'], 'bar')).toBe('bar');
  // Multuple choices cases
  expect(autoCompleteOnePart(['idea', 'ideology'], 'id')).toBe('ide');
  // No choices cases
  expect(autoCompleteOnePart(['foo', 'bar', 'idea', 'ideology'], 'random')).toBe(null);
  // Empty string cases
  expect(autoCompleteOnePart(['foo', 'bar'], '')).toBe('');
});

it('autoComplete works', () => {
  // One choice cases
  expect(autoComplete(['foo', 'bar'], 'f')).toBe('foo');
  expect(autoComplete(['foo', 'bar'], 'fo')).toBe('foo');
  expect(autoComplete(['foo', 'bar'], 'foo')).toBe('foo');
  expect(autoComplete(['foo', 'bar'], 'b')).toBe('bar');
  expect(autoComplete(['foo', 'bar'], 'ba')).toBe('bar');
  expect(autoComplete(['foo', 'bar'], 'bar')).toBe('bar');
  expect(autoComplete(['foo', 'bar'], 'command f')).toBe('command foo');
  expect(autoComplete(['foo', 'bar'], 'command fo')).toBe('command foo');
  expect(autoComplete(['foo', 'bar'], 'command foo')).toBe('command foo');
  expect(autoComplete(['foo', 'bar'], 'command b')).toBe('command bar');
  expect(autoComplete(['foo', 'bar'], 'command ba')).toBe('command bar');
  expect(autoComplete(['foo', 'bar'], 'command bar')).toBe('command bar');
  // Multuple choices cases
  expect(autoComplete(['idea', 'ideology'], 'id')).toBe('ide');
  expect(autoComplete(['idea', 'ideology'], 'command id')).toBe('command ide');
  // No choices cases
  expect(autoComplete(['foo', 'bar', 'idea', 'ideology'], 'random')).toBe('random');
  expect(autoComplete(['foo', 'bar', 'idea', 'ideology'], 'foo random')).toBe('foo random');
  expect(autoComplete(['foo', 'bar', 'idea', 'ideology'], ' foo random ')).toBe('foo random');
  // Empty string cases
  expect(autoComplete(['foo', 'bar'], '')).toBe('');
});
