import React, { ReactElement, useEffect } from 'react';
import ReactGA from 'react-ga';
import { RecoilRoot } from 'recoil';

import 'lib-react/PrismCodeBlock.css';
import 'lib-web-terminal/styles.css';
import './index.css';
import './app.css';
import AppBody from './components/App';
import {
  useSetDeveloperSamOnBirthday,
  useTerminalForceOnBirthday,
} from './components/global-states';

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  ReactGA.initialize('UA-140662756-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const AppContent = (): ReactElement => {
  const setOnBirthday = useSetDeveloperSamOnBirthday();
  const terminalForceOnBirthday = useTerminalForceOnBirthday();

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const onBirthday = today.getMonth() === 10 && today.getDate() === 15;
      setOnBirthday(terminalForceOnBirthday || onBirthday);
    }, 200);
    return () => clearInterval(interval);
  }, [terminalForceOnBirthday, setOnBirthday]);

  return <AppBody />;
};

const App = (): ReactElement => (
  <RecoilRoot>
    <AppContent />
  </RecoilRoot>
);

export default App;
