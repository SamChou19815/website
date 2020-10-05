import { initialState } from '../../filesystem';
import autoComplete, { autoCompleteCommand, autoCompleteFilename } from './auto-complete';
import commands from './commands';

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
  // Empty string cases
  expect(autoComplete(commands, '')).toBe('');
  // No choices cases
  expect(autoComplete(commands, 'random')).toBe('random');
  expect(autoComplete(commands, 'foo random')).toBe('foo random');
  expect(autoComplete(commands, ' foo random ')).toBe('foo random');
  // Command autocompletion.
  expect(autoComplete(commands, 'l')).toBe('ls');
  expect(autoComplete(commands, 'ca')).toBe('cat');
  expect(autoComplete(commands, 'cd')).toBe('cd');
  expect(autoComplete(commands, 'h')).toBe('help');
  // Filename autocompletion
  expect(autoComplete(commands, 'cat R')).toBe('cat README.md');
  expect(autoComplete(commands, 'cat ./R')).toBe('cat README.md');
  expect(autoComplete(commands, 'cat b')).toBe('cat blog.txt');
  expect(autoComplete(commands, 'cat ./b')).toBe('cat blog.txt');
  expect(autoComplete(commands, 'cat g')).toBe('cat github.txt');
  expect(autoComplete(commands, 'cat ./g')).toBe('cat github.txt');
  expect(autoComplete(commands, 'cat t')).toBe('cat top-secret');
  expect(autoComplete(commands, 'cat ./t')).toBe('cat top-secret');
  expect(autoComplete(commands, 'cat top-secret/f')).toBe('cat top-secret/fact.txt');
  expect(autoComplete(commands, 'cat top-secret/r')).toBe('cat top-secret/real-secret');
  expect(autoComplete(commands, 'cat top-secret/a')).toBe('cat top-secret/a');
  expect(autoComplete(commands, 'cat top-secret/real-secret/ra')).toBe(
    'cat top-secret/real-secret/random'
  );
  expect(autoComplete(commands, 'cat top-secret/real-secret/re')).toBe(
    'cat top-secret/real-secret/real-fact.txt'
  );
  expect(autoComplete(commands, 'cat top-secret/real-secret/random/a')).toBe(
    'cat top-secret/real-secret/random/actual-fact.txt'
  );
});
