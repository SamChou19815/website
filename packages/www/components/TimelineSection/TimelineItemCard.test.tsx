import React from 'react';

import renderer from 'react-test-renderer';

import timelineItems from '../../data/timeline';
import TimelineItemCard from './TimelineItemCard';

for (let i = 0; i < timelineItems.length; i += 1) {
  it(`TimelineItemCard with item ${i} matches snapshot.`, () => {
    const tree = renderer.create(<TimelineItemCard item={timelineItems[i]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}
