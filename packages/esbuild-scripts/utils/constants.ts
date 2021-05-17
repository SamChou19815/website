import { join } from 'path';

export const TEMPLATE_PATH = join(__dirname, 'templates');
export const DOCS_PATH = join('docs');
export const PAGES_PATH = join('src', 'pages');
export const GENERATED_PAGES_PATH = join('src', 'generated-pages');
export const SSR_JS_PATH = join('build', '__ssr.jsx');
export const SSR_LICENSE_PATH = join('build', '__ssr.jsx.LEGAL.txt');
export const SSR_CSS_PATH = join('build', '__ssr.css');
export const BUILD_PATH = 'build';
export const VIRTUAL_PATH_PREFIX = 'esbuild-scripts-internal/virtual/';
export const VIRTUAL_SERVER_ENTRY_PATH = `${VIRTUAL_PATH_PREFIX}__server__.jsx`;
