import React from 'react';
import renderer from 'react-test-renderer';
import { WebTerminal } from '.';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ignore = () => {};

it(`WebTerminal(shown) matches snapshot.`, () => {
  const tree = renderer.create(<WebTerminal shown onTrigger={ignore} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it(`WebTerminal(hidden) matches snapshot.`, () => {
  const tree = renderer.create(<WebTerminal shown={false} onTrigger={ignore} />).toJSON();
  expect(tree).toMatchSnapshot();
});
