import React from 'react';

import renderer from 'react-test-renderer';

import AboutSection from './AboutSection';

it('AboutSection matches snapshot.', () => {
  const tree = renderer.create(<AboutSection />).toJSON();
  expect(tree).toMatchSnapshot();
});
