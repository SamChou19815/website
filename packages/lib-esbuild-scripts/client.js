import { createElement } from 'react';
import { hydrate, render } from 'react-dom';

import App from '../src/App';

const rootElement = document.getElementById('root');
if (rootElement == null) throw new Error('root element is not found in index.html');
if (rootElement.hasChildNodes()) {
  hydrate(createElement(App), rootElement);
} else {
  render(createElement(App), rootElement);
}
