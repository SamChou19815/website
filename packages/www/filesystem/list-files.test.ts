import initialState, { root } from './initial-state';
import listFiles, {
  listFilesInDirectoryWithRelativePath,
  listFilesInDirectory,
} from './list-files';
import type { Directory } from './types';

it('listFilesInDirectory works', () => {
  expect(listFilesInDirectory(root)).toBe('top-secret/\nblog.txt\ngithub.txt\nREADME.md\nwww.txt');
  expect(listFilesInDirectory(root.children[0][1] as Directory)).toBe('real-secret/\nfact.txt');
  expect(listFilesInDirectory((root.children[0][1] as Directory).children[0][1] as Directory)).toBe(
    'random/\nreal-fact.txt'
  );
  expect(
    listFilesInDirectory(
      ((root.children[0][1] as Directory).children[0][1] as Directory).children[0][1] as Directory
    )
  ).toBe('actual-fact.txt');
});

it('listFilesInDirectoryWithRelativePath works', () => {
  expect(
    listFilesInDirectoryWithRelativePath(initialState, './.././top-secret/real-secret/random')
  ).toBe('actual-fact.txt');
});

it('listFiles works', () => {
  expect(listFiles(initialState, [])).toBe('top-secret/\nblog.txt\ngithub.txt\nREADME.md\nwww.txt');
  expect(listFiles(initialState, ['.'])).toBe(
    'top-secret/\nblog.txt\ngithub.txt\nREADME.md\nwww.txt'
  );
  expect(listFiles(initialState, ['top-secret/real-secret/random', 'top-secret'])).toBe(
    'top-secret/real-secret/random:\nactual-fact.txt\n\ntop-secret:\nreal-secret/\nfact.txt'
  );
});
