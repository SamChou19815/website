import React from 'react';

import renderer from 'react-test-renderer';

import ResultCard from './ResultCard';
import { Response } from './interpret';

it('ResultCard(GOOD_PROGRAM) matches snapshot.', () => {
  const response: Response = {
    interpreterResult: 'result',
    interpreterPrinted: 'printed',
    prettyPrintedProgram: 'class Main {}',
    assemblyString: 'assembly',
    errors: [],
  };
  const tree = renderer.create(<ResultCard response={response} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('ResultCard(WITH_ERROR) matches snapshot.', () => {
  const response: Response = {
    interpreterResult: null,
    interpreterPrinted: null,
    prettyPrintedProgram: null,
    assemblyString: null,
    errors: ['ahhh'],
  };
  const tree = renderer.create(<ResultCard response={response} />).toJSON();
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
