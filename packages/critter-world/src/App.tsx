import React, { ReactElement } from 'react';

import AppBody from './components/App';
import LoginBarrier from './components/LoginBarrier';
import { initializeWindowSizeHooksListeners } from './utils/window-size-hook';

import './index.css';
import './app.css';

if (!__SERVER__) initializeWindowSizeHooksListeners();

const App = (): ReactElement => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__items">
            <a className="navbar__brand" href="/">
              <strong className="navbar__title">Critter World Web UI</strong>
            </a>
          </div>
          <div className="navbar__items navbar__items--right">
            <a className="navbar__item navbar__link" href="https://developersam.com">
              Developer Sam
            </a>
          </div>
        </div>
      </nav>
      <LoginBarrier>
        <AppBody />
      </LoginBarrier>
    </div>
  );
};

export default App;
