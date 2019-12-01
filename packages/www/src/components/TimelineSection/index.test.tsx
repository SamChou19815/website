import React from 'react';
import renderer from 'react-test-renderer';
import TimelineSection from '.';

it('TimelineSection matches snapshot.', () => {
  const tree = renderer.create(<TimelineSection />).toJSON();
  expect(tree).toMatchSnapshot();
});
