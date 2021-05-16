import React from 'react';

const Rules = (): JSX.Element => (
  <div className="card">
    <div className="card__header">Rules</div>
    <div className="card__body">
      The rules are mostly the same with the original{' '}
      <a href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
        TEN game (Ultimate tic-tac-toe)
      </a>
      , except that a draw is a win for white in this game. AI thinking time is 1.5s.
    </div>
  </div>
);

export default Rules;
