/* eslint-disable */

import { createElement } from 'react';
import { hydrate, render } from 'react-dom';

import App from 'USER_DEFINED_APP_ENTRY_POINT';

if (!__SERVER__ && __THEME_SWITCH__) {
  const setTheme = (theme) => document.documentElement.setAttribute('data-theme', theme);
  if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('');
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: m }) => setTheme(m ? 'dark' : ''));
}

const rootElement = document.getElementById('root');
if (rootElement == null) throw new Error('root element is not found in index.html');
if (rootElement.hasChildNodes()) {
  hydrate(createElement(App), rootElement);
} else {
  render(createElement(App), rootElement);
}
