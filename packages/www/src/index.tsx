import React from 'react';
import { hydrate, render } from 'react-dom';

import './index.css';
import initializeHighlighter from 'lib-react/language';

import App from './App';

export default function initialize() {
  initializeHighlighter();

  const rootElement = document.getElementById('root');
  if (rootElement != null) {
    if (rootElement.hasChildNodes()) {
      hydrate(<App />, rootElement);
    } else {
      render(<App />, rootElement);
    }
  }
}

initialize();
