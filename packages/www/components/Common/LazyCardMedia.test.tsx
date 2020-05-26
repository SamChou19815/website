import React from 'react';

import renderer from 'react-test-renderer';

import LazyCardMedia from './LazyCardMedia';

it('LazyCardMedia matches snapshot.', () => {
  const tree = renderer.create(<LazyCardMedia image="test" title="title" />).toJSON();
  expect(tree).toMatchSnapshot();
});
