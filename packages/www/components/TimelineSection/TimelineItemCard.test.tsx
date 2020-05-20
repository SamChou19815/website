import React from 'react';

import renderer from 'react-test-renderer';

import TimelineItemCard from './TimelineItemCard';
import items from './items';

for (let i = 0; i < items.length; i += 1) {
  it(`TimelineItemCard with item ${i} matches snapshot.`, () => {
    const tree = renderer.create(<TimelineItemCard item={items[i]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}
