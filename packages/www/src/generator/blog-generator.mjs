// @ts-check

import mainRunner from 'esbuild-scripts/api.js';

// @ts-expect-error CJS-ESM interop
mainRunner.default(async () => {
  await import('./codegen.mjs');
  return {};
});
