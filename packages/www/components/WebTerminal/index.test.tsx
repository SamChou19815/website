import React from 'react';
import ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils';

import WebTerminal from '.';

it('Can trigger', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    ReactDOM.render(<WebTerminal />, container);
  });
  const buttonNode = document.querySelector('button') as HTMLButtonElement;

  act(() => {
    buttonNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  act(() => {
    buttonNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  document.body.removeChild(container);
});
