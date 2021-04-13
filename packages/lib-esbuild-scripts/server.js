/* eslint-disable import/order */

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import App from 'USER_DEFINED_APP_ENTRY_POINT';

module.exports = renderToString(createElement(App));
