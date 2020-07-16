import React from 'react';
import ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils';

import Terminal from './Terminal';

it('Terminal can respond to inputs.', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    ReactDOM.render(<Terminal />, container);
  });
  const inputNode = document.querySelectorAll('[name="terminal-input"]')[0] as HTMLInputElement;

  act(() => {
    window.getSelection = () => null;
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });

  act(() => {
    window.getSelection = () => null;
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    // @ts-expect-error: non standard
    window.getSelection = () => ({ type: 'Range' });
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });
  expect(inputNode.value).toBe('');

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  });

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  });

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  });

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));
  });

  document.body.removeChild(container);
});
