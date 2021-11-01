import { copyFile, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import { TEMPLATE_PATH, PAGES_PATH } from './utils/constants';

export default async function initCommand(): Promise<void> {
  await mkdir(PAGES_PATH, { recursive: true });
  await Promise.all([
    copyFile(join(TEMPLATE_PATH, '_document.tsx'), join(PAGES_PATH, '_document.tsx')),
    copyFile(join(TEMPLATE_PATH, 'index.tsx'), join(PAGES_PATH, 'index.tsx')),
    writeFile(join(PAGES_PATH, 'index.css'), ''),
    writeFile(join('src', 'types.d.ts'), '/// <reference types="esbuild-scripts" />\n'),
    mkdir('public', { recursive: true }),
  ]);
}
