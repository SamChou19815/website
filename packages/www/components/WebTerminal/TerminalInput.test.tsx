import React, { ReactElement, useRef } from 'react';
import ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils';

import TerminalInput from './TerminalInput';

it('TerminalInput can respond to inputs.', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  let upTyped = false;
  let downTyped = false;
  let enterTyped = false;

  const onArrow = (direction: 'up' | 'down'): string | null => {
    if (direction === 'up') {
      upTyped = true;
      return null;
    }
    downTyped = true;
    return 'ah!';
  };
  const onSubmit = (): void => {
    enterTyped = true;
  };

  const Wrapper = (): ReactElement => {
    const terminalInput = useRef<HTMLInputElement>(null);
    return <TerminalInput terminalInput={terminalInput} onArrow={onArrow} onSubmit={onSubmit} />;
  };

  act(() => {
    ReactDOM.render(<Wrapper />, container);
  });
  const inputNode = document.querySelectorAll('[name="terminal-input"]')[0] as HTMLInputElement;

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });
  expect(enterTyped).toBeTruthy();

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  });
  expect(upTyped).toBeTruthy();

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  });
  expect(downTyped).toBeTruthy();
  expect(inputNode.value).toBe('ah!');

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  });
  expect(inputNode.value).toBe('ah!');

  act(() => {
    inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));
  });

  document.body.removeChild(container);
});
