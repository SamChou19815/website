import React from 'react';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import renderer from 'react-test-renderer';

it('Simple MaterialButtonLink matches snapshot.', () => {
  const tree = renderer
    .create(<MaterialButtonLink href="haha">I am button</MaterialButtonLink>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Simple MaterialButtonLink with primary color matches snapshot.', () => {
  const tree = renderer
    .create(
      <MaterialButtonLink href="haha" color="primary">
        I am button
      </MaterialButtonLink>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Simple MaterialButtonLink with secondary color matches snapshot.', () => {
  const tree = renderer
    .create(
      <MaterialButtonLink href="haha" color="secondary">
        I am button
      </MaterialButtonLink>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Simple MaterialButtonLink with inherit color matches snapshot.', () => {
  const tree = renderer
    .create(
      <MaterialButtonLink href="haha" color="inherit">
        I am button
      </MaterialButtonLink>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
