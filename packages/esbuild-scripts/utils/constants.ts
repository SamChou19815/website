import * as path from 'path';

export const PAGES_PATH = path.join('src', 'pages');
export const SSR_JS_PATH = path.join('build', '__ssr.mjs');
export const BUILD_PATH = 'build';
export const OUT_PATH = 'out';
export const VIRTUAL_PATH_PREFIX = 'esbuild-scripts-internal/virtual/';
export const VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX = `${VIRTUAL_PATH_PREFIX}__generated-entry-point__/`;
export const VIRTUAL_SERVER_ENTRY_PATH = `${VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX}__server__.mjs`;
