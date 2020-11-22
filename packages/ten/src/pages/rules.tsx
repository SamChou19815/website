import React, { ReactElement } from 'react';

import App from '../components/App';

import './index.css';

export default function Rules(): ReactElement {
  return (
    <App>
      <div className="card">
        <div className="card__header">Rules</div>
        <div className="card__body">
          The rules are mostly the same with the original&nbsp;
          <a href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            TEN game (Ultimate tic-tac-toe)
          </a>
          , except that a draw is a win for white in this game. AI thinking time is 1.5s.
        </div>
      </div>
    </App>
  );
}
