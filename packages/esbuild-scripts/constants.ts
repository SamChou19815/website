import { join } from 'path';

export const CLIENT_ENTRY = join(__dirname, 'entries', 'client.ts');
export const SERVER_ENTRY = join(__dirname, 'entries', 'server.ts');
export const PAGES_PATH = join('src', 'pages');
export const SSR_JS_PATH = join('build', '__ssr.js');
export const SSR_CSS_PATH = join('build', '__ssr.css');
export const BUILD_HTML_PATH = join('build', 'index.html');
export const BUILD_APP_JS_PATH = join('build', 'app.js');
export const BUILD_APP_CSS_PATH = join('build', 'app.css');