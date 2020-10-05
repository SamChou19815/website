import autoComplete, { autoCompleteCommand, autoCompleteFilename } from './auto-complete';
import baseCommands from './base-commands';

import { initialState } from 'lib-in-memory-filesystem';

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
  expect(autoComplete(baseCommands, '')).toBe('');
  // No choices cases
  expect(autoComplete(baseCommands, 'random')).toBe('random');
  expect(autoComplete(baseCommands, 'foo random')).toBe('foo random');
  expect(autoComplete(baseCommands, ' foo random ')).toBe('foo random');
  // Command autocompletion.
  expect(autoComplete(baseCommands, 'l')).toBe('ls');
  expect(autoComplete(baseCommands, 'ca')).toBe('cat');
  expect(autoComplete(baseCommands, 'cd')).toBe('cd');
  // Filename autocompletion
  expect(autoComplete(baseCommands, 'cat R')).toBe('cat README.md');
  expect(autoComplete(baseCommands, 'cat ./R')).toBe('cat README.md');
  expect(autoComplete(baseCommands, 'cat b')).toBe('cat blog.txt');
  expect(autoComplete(baseCommands, 'cat ./b')).toBe('cat blog.txt');
  expect(autoComplete(baseCommands, 'cat g')).toBe('cat github.txt');
  expect(autoComplete(baseCommands, 'cat ./g')).toBe('cat github.txt');
  expect(autoComplete(baseCommands, 'cat t')).toBe('cat top-secret');
  expect(autoComplete(baseCommands, 'cat ./t')).toBe('cat top-secret');
  expect(autoComplete(baseCommands, 'cat top-secret/f')).toBe('cat top-secret/fact.txt');
  expect(autoComplete(baseCommands, 'cat top-secret/r')).toBe('cat top-secret/real-secret');
  expect(autoComplete(baseCommands, 'cat top-secret/a')).toBe('cat top-secret/a');
  expect(autoComplete(baseCommands, 'cat top-secret/real-secret/ra')).toBe(
    'cat top-secret/real-secret/random'
  );
  expect(autoComplete(baseCommands, 'cat top-secret/real-secret/re')).toBe(
    'cat top-secret/real-secret/real-fact.txt'
  );
  expect(autoComplete(baseCommands, 'cat top-secret/real-secret/random/a')).toBe(
    'cat top-secret/real-secret/random/actual-fact.txt'
  );
});
