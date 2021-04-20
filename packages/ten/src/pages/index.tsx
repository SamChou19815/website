import React, { ReactElement } from 'react';

import LocalGameCard from '../components/LocalGameCard';
import PlayAgainstAIGameCard from '../components/PlayAgainstAIGameCard';

import Switch from 'esbuild-scripts/__internal-components__/Switch';
import Route from 'esbuild-scripts/components/Route';

const Rules = () => (
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
);

const App = (): ReactElement => (
  <Switch>
    <Route path="/local">
      <LocalGameCard />
    </Route>
    <Route path="/rules">
      <Rules />
    </Route>
    <Route path="/">
      <PlayAgainstAIGameCard />
    </Route>
  </Switch>
);

export default App;
