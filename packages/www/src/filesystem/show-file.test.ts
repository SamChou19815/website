import initialState, { root } from './initial-state';
import showFiles, { showFileInDirectory } from './show-file';

it('showFileInDirectory works', () => {
  expect(showFileInDirectory(root, 'www.txt')).toBe('https://developersam.com/');
  expect(showFileInDirectory(root, 'www.random')).toBe(null);
});

it('showFiles works', () => {
  expect(showFiles(initialState, ['README.md', 'www.txt'])).toBe(
    '# Developer Samhttps://developersam.com/'
  );
});
