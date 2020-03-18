import React from 'react';

import renderer from 'react-test-renderer';

import FirstPage from '.';

it('FirstPage matches snapshot.', () => {
  const tree = renderer.create(<FirstPage />).toJSON();
  expect(tree).toMatchSnapshot();
});
