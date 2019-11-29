import autoComplete, { autoCompleteCommand, autoCompleteFilename } from './auto-complete';
import { initialState } from '../../filesystem';

it('autoCompleteCommand works', () => {
  // One choice cases
  expect(autoCompleteCommand(['foo', 'bar'], 'f')).toBe('foo');
  expect(autoCompleteCommand(['foo', 'bar'], 'fo')).toBe('foo');
  expect(autoCompleteCommand(['foo', 'bar'], 'foo')).toBe('foo');
  expect(autoCompleteCommand(['foo', 'bar'], 'b')).toBe('bar');
  expect(autoCompleteCommand(['foo', 'bar'], 'ba')).toBe('bar');
  expect(autoCompleteCommand(['foo', 'bar'], 'bar')).toBe('bar');
  // Multuple choices cases
  expect(autoCompleteCommand(['idea', 'ideology'], 'id')).toBe('ide');
  // No choices cases
  expect(autoCompleteCommand(['foo', 'bar', 'idea', 'ideology'], 'random')).toBe(null);
  // Empty string cases
  expect(autoCompleteCommand(['foo', 'bar'], '')).toBe('');
});

it('autoCompleteFilename works', () => {
  expect(autoCompleteFilename(initialState, 'R')).toBe('README.md');
  expect(autoCompleteFilename(initialState, './R')).toBe('README.md');
  expect(autoCompleteFilename(initialState, 'b')).toBe('blog.txt');
  expect(autoCompleteFilename(initialState, './b')).toBe('blog.txt');
  expect(autoCompleteFilename(initialState, 'g')).toBe('github.txt');
  expect(autoCompleteFilename(initialState, './g')).toBe('github.txt');
  expect(autoCompleteFilename(initialState, 't')).toBe('top-secret');
  expect(autoCompleteFilename(initialState, './t')).toBe('top-secret');
  expect(autoCompleteFilename(initialState, 'top-secret/f')).toBe('top-secret/fact.txt');
  expect(autoCompleteFilename(initialState, 'top-secret/r')).toBe('top-secret/real-secret');
  expect(autoCompleteFilename(initialState, 'top-secret/a')).toBe(null);
  expect(autoCompleteFilename(initialState, 'top-secret/real-secret/ra')).toBe(
    'top-secret/real-secret/random'
  );
  expect(autoCompleteFilename(initialState, 'top-secret/real-secret/re')).toBe(
    'top-secret/real-secret/real-fact.txt'
  );
  expect(autoCompleteFilename(initialState, 'top-secret/real-secret/random/a')).toBe(
    'top-secret/real-secret/random/actual-fact.txt'
  );
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
