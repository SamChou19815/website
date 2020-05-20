import React from 'react';
import ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import Default, { WebTerminal } from '.';

const ignore = () => {};

it(`WebTerminal(shown) matches snapshot.`, () => {
  const tree = renderer.create(<WebTerminal shown onTrigger={ignore} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it(`WebTerminal(hidden) matches snapshot.`, () => {
  const tree = renderer.create(<WebTerminal shown={false} onTrigger={ignore} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it(`Default matches snapshot.`, () => {
  const tree = renderer.create(<Default />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Can trigger', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  act(() => {
    ReactDOM.render(<Default />, container);
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
