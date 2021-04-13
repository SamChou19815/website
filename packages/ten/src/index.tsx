import React from 'react';
import { hydrate, render } from 'react-dom';

import App from './App';

const rootElement = document.getElementById('root');
if (rootElement == null) throw new Error('root element is not found in index.html');
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
