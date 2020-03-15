import React from 'react';
import { render } from 'react-dom';
import './util/firebase-initialization';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('We messed up the DOM tree!');
}
render(<App />, rootElement);
