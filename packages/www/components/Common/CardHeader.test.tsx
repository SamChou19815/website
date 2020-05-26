import React from 'react';

import renderer from 'react-test-renderer';

import CardHeader from './CardHeader';

it('Simple CardHeader matches snapshot.', () => {
  const tree = renderer.create(<CardHeader title="t" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Simple CardHeader with subheader matches snapshot.', () => {
  const tree = renderer.create(<CardHeader title="t" subheader="s" />).toJSON();
  expect(tree).toMatchSnapshot();
});
