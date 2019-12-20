import React from 'react';
import renderer from 'react-test-renderer';
import BoardCell from './BoardCell';

const dummyOnClick = () => {};

it('BoardCell(1, true) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={1} doesNeedHighlight onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('BoardCell(1, false) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={1} doesNeedHighlight={false} onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('BoardCell(-1, true) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={-1} doesNeedHighlight onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('BoardCell(-1, false) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={-1} doesNeedHighlight={false} onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('BoardCell(0, true) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={0} doesNeedHighlight onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('BoardCell(0, false) matches snapshot.', () => {
  const tree = renderer
    .create(<BoardCell tileStatus={0} doesNeedHighlight={false} onClick={dummyOnClick} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
