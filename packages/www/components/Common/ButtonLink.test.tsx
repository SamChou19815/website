import React from 'react';

import renderer from 'react-test-renderer';

import ButtonLink from './ButtonLink';

it('Simple ButtonLink matches snapshot.', () => {
  const tree = renderer.create(<ButtonLink href="haha">I am a button</ButtonLink>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Simple ButtonLink with class matches snapshot.', () => {
  const tree = renderer
    .create(
      <ButtonLink href="haha" className="clazz">
        I am a button
      </ButtonLink>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
