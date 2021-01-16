/* eslint-disable no-alert */
import React, { ReactElement, useState } from 'react';

import { sendLoginRequest } from '../utils/http';
import LoginCard from './LoginCard';

import LoadingOverlay from 'lib-react/LoadingOverlay';

type Props = { readonly children: ReactElement };

type AppStatus = 'LOADING' | 'LANDING' | 'APP';

/**
 * The barrier to enter the main app.
 * It can help to enforce that all necessary information is loaded before entering the main app.
 */
const LoginBarrier = ({ children }: Props): ReactElement => {
  const [appStatus, setAppStatus] = useState<AppStatus>('LANDING');

  const onLoginSubmit = (url: string, accessLevel: AccessLevel, password: string): void => {
    setAppStatus('LOADING');
    sendLoginRequest(url, accessLevel, password)
      .then((success) => {
        if (success) {
          setAppStatus('APP');
        } else {
          alert('Wrong password.');
          setAppStatus('LANDING');
        }
      })
      .catch(() => {
        alert('Failed to login. Probably the server is not live.');
        setAppStatus('LANDING');
      });
  };

  switch (appStatus) {
    case 'LANDING':
      return <LoginCard onSubmit={onLoginSubmit} />;
    case 'LOADING':
      return <LoadingOverlay />;
    case 'APP':
      return children;
  }
};

export default LoginBarrier;
