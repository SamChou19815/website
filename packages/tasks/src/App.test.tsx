import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

it('App matches snapshot.', () => {
  expect(renderer.create(<App />).toJSON()).toMatchSnapshot();
});
