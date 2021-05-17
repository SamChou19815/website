import { join } from 'path';

import { GREEN } from 'lib-colorful-terminal/colors';

import { TEMPLATE_PATH, PAGES_PATH } from './utils/constants';
import { copyFile, ensureDirectory, writeFile } from './utils/fs';

const initCommand = async (): Promise<void> => {
  await ensureDirectory(PAGES_PATH);
  await Promise.all([
    copyFile(join(TEMPLATE_PATH, '_document.tsx'), join(PAGES_PATH, '_document.tsx')),
    copyFile(join(TEMPLATE_PATH, 'index.tsx'), join(PAGES_PATH, 'index.tsx')),
    writeFile(join(PAGES_PATH, 'index.css'), ''),
    writeFile(join('src', 'types.d.ts'), '/// <reference types="esbuild-scripts" />\n'),
    ensureDirectory('public'),
  ]);
  // eslint-disable-next-line no-console
  console.error(GREEN('esbuild-scripts app initialized.'));
};

export default initCommand;
