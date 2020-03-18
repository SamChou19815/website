import React from 'react';

import renderer from 'react-test-renderer';

import LazyMaterialMedia from './LazyMaterialMedia';

it('LazyMaterialMedia matches snapshot.', () => {
  const tree = renderer.create(<LazyMaterialMedia image="test" title="title" />).toJSON();
  expect(tree).toMatchSnapshot();
});
