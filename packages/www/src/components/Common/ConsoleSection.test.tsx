import React from 'react';
import renderer from 'react-test-renderer';
import ConsoleSection from './ConsoleSection';

it('ConsoleSection matches snapshot.', () => {
  const tree = renderer
    .create(
      <ConsoleSection id="test" title="title">
        A
      </ConsoleSection>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
