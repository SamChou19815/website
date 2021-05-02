import runner from 'esbuild-scripts/run';
import { GENERATED_PAGES_PATH } from 'esbuild-scripts/utils/constants';
import { emptyDirectory, ensureDirectory, readDirectory } from 'lib-fs';

runner(async () => {
  const docs = await readDirectory('docs', true);
  // eslint-disable-next-line no-console
  console.log(docs);
  await ensureDirectory(GENERATED_PAGES_PATH);
  await emptyDirectory(GENERATED_PAGES_PATH);
});
