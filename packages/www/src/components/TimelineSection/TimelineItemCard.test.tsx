import React from 'react';
import renderer from 'react-test-renderer';
import items from './items';
import TimelineItemCard from './TimelineItemCard';

for (let i = 0; i < items.length; i += 1) {
  it(`TimelineItemCard with item ${i} matches snapshot.`, () => {
    const tree = renderer.create(<TimelineItemCard item={items[i]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}
