import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';
import './language';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('We messed up the DOM tree!');
}
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
