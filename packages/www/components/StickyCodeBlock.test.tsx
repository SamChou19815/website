import React from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';
import renderer from 'react-test-renderer';

import { store } from '../store';
import FirstPageCodeBlock from './StickyCodeBlock';

it('FirstPageCodeBlock matches snapshot.', () => {
  const tree = renderer
    .create(
      <ReactReduxProvider store={store}>
        <FirstPageCodeBlock />
      </ReactReduxProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
