import initialState, { root } from './initial-state';
import listFiles, {
  listFilesInDirectoryWithRelativePath,
  listFilesInDirectory,
} from './list-files';

import type { Directory } from './types';

it('listFilesInDirectory works', () => {
  expect(listFilesInDirectory(root)).toEqual([
    'top-secret/',
    'blog.txt',
    'github.txt',
    'README.md',
    'www.txt',
  ]);
  expect(listFilesInDirectory(root.children[0]?.[1] as Directory)).toEqual([
    'real-secret/',
    'fact.txt',
  ]);
  expect(
    listFilesInDirectory((root.children[0]?.[1] as Directory).children?.[0]?.[1] as Directory)
  ).toEqual(['random/', 'real-fact.txt']);
  expect(
    listFilesInDirectory(
      ((root.children[0]?.[1] as Directory).children[0]?.[1] as Directory)
        .children?.[0]?.[1] as Directory
    )
  ).toEqual(['actual-fact.txt']);
});

it('listFilesInDirectoryWithRelativePath works', () => {
  expect(
    listFilesInDirectoryWithRelativePath(initialState, './.././top-secret/real-secret/random')
  ).toEqual(['actual-fact.txt']);
});

it('listFiles works', () => {
  expect(listFiles(initialState, [])).toEqual([
    'top-secret/',
    'blog.txt',
    'github.txt',
    'README.md',
    'www.txt',
  ]);
  expect(listFiles(initialState, ['.'])).toEqual([
    'top-secret/',
    'blog.txt',
    'github.txt',
    'README.md',
    'www.txt',
  ]);
  expect(listFiles(initialState, ['top-secret/real-secret/random', 'top-secret'])).toEqual([
    'top-secret/real-secret/random:',
    'actual-fact.txt',
    'top-secret:',
    'real-secret/',
    'fact.txt',
  ]);
});
