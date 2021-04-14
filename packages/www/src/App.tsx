import React, { ReactElement } from 'react';
import ReactGA from 'react-ga';
import { RecoilRoot } from 'recoil';

import AppContent from './components/AppContent';

import initializeThemeSwitching from 'lib-react/theme-switcher-initializer';

import 'infima/dist/css/default/default.min.css';
import 'lib-react/PrismCodeBlock.css';
import 'lib-web-terminal/styles.css';
import './index.css';
import './app.scss';

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  ReactGA.initialize('UA-140662756-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

if (!__SERVER__) {
  initializeThemeSwitching();
}

const App = (): ReactElement => (
  <RecoilRoot>
    <AppContent />
  </RecoilRoot>
);

export default App;
