import React from 'react';

import renderer from 'react-test-renderer';

import ProjectsSection from './ProjectsSection';

it('ProjectsSection matches snapshot.', () => {
  const tree = renderer.create(<ProjectsSection />).toJSON();
  expect(tree).toMatchSnapshot();
});
