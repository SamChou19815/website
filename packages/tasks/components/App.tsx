import React, { ReactElement } from 'react';

import Head from 'next/head';
import { Provider as ReactReduxProvider } from 'react-redux';

import { store } from '../models/redux-store';
import HomePage from './pages/HomePage';

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <Head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#F7F7F7" />
      <link rel="manifest" href="/manifest.json" />
      <title>Tasks - Developer Sam Apps</title>
    </Head>
    <HomePage />
  </ReactReduxProvider>
);
