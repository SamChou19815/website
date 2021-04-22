import { join } from 'path';

export const TEMPLATE_PATH = join(__dirname, 'templates');
export const TEMP_PATH = '.temp';
export const TEMP_SERVER_ENTRY_PATH = join('.temp', '__server__.jsx');
export const PAGES_PATH = join('src', 'pages');
export const SSR_JS_PATH = join('build', '__ssr.js');
export const SSR_CSS_PATH = join('build', '__ssr.css');
export const BUILD_PATH = 'build';