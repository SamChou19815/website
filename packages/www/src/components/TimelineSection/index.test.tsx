import React from 'react';
import renderer from 'react-test-renderer';
import { TimelineSection } from '.';

it('TimelineSection(000) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked={false} projectsChecked={false} eventsChecked={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(001) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked={false} projectsChecked={false} eventsChecked />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(010) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked={false} projectsChecked eventsChecked={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(011) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked={false} projectsChecked eventsChecked />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(100) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked projectsChecked={false} eventsChecked={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(101) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked projectsChecked={false} eventsChecked />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(110) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked projectsChecked eventsChecked={false} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('TimelineSection(111) matches snapshot.', () => {
  const tree = renderer
    .create(<TimelineSection workChecked projectsChecked eventsChecked />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
