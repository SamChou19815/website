import React from 'react';

import renderer from 'react-test-renderer';

import FirstPageCodeBlock from './StickyCodeBlock';

it('FirstPageCodeBlock matches snapshot.', () => {
  const tree = renderer.create(<FirstPageCodeBlock />).toJSON();
  expect(tree).toMatchSnapshot();
});
