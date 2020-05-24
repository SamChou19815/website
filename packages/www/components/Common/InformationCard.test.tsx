import React from 'react';

import renderer from 'react-test-renderer';

import InformationCard from './InformationCard';

it('InformationCard matches snapshot.', () => {
  const tree = renderer.create(<InformationCard />).toJSON();
  expect(tree).toMatchSnapshot();
});
