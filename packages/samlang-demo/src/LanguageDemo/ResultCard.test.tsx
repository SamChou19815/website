import React from 'react';
import renderer from 'react-test-renderer';
import ResultCard from './ResultCard';

it('ResultCard(GOOD_PROGRAM) matches snapshot.', () => {
  const response = {
    type: 'GOOD_PROGRAM',
    detail: { result: 'haha', prettyPrintedProgram: 'class HelloWorld {}' }
  };
  const tree = renderer.create(<ResultCard response={response} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(BAD_SYNTAX) matches snapshot.', () => {
  const tree = renderer
    .create(<ResultCard response={{ type: 'BAD_SYNTAX', detail: 'foo' }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(BAD_TYPE) matches snapshot.', () => {
  const tree = renderer
    .create(<ResultCard response={{ type: 'BAD_TYPE', detail: 'bar' }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(waiting) matches snapshot.', () => {
  const tree = renderer.create(<ResultCard response="waiting" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(server-error) matches snapshot.', () => {
  const tree = renderer.create(<ResultCard response="server-error" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(null) matches snapshot.', () => {
  const tree = renderer.create(<ResultCard response={null} />).toJSON();
  expect(tree).toMatchSnapshot();
});
