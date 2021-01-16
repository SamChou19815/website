import type { ReactElement } from 'react';

import App from '../components/App';
import LoginBarrier from '../components/LoginBarrier';

const IndexPage = (): ReactElement => {
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
        <App />
      </LoginBarrier>
    </div>
  );
};

export default IndexPage;
