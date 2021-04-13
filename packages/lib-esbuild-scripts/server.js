import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import App from '../src/App';

module.exports = renderToString(createElement(App));
