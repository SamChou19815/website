import React from 'react';

import renderer from 'react-test-renderer';

import FirstPageCodeBlock from './FirstPageCodeBlock';

it('FirstPageCodeBlock matches snapshot.', () => {
  const tree = renderer.create(<FirstPageCodeBlock />).toJSON();
  expect(tree).toMatchSnapshot();
});
