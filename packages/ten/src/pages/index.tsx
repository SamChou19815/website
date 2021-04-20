import React, { ReactElement } from 'react';
import { BrowserRouter, StaticRouter, Switch, Route, Link } from 'react-router-dom';

import LocalGameCard from '../components/LocalGameCard';
import PlayAgainstAIGameCard from '../components/PlayAgainstAIGameCard';

import 'infima/dist/css/default/default.min.css';
import './index.css';
import './game.css';

function SSRLink({ to, children }: Readonly<{ to: string; children: string }>): ReactElement {
  if (__SERVER__) {
    return (
      <a className="navbar__item navbar__link" href={to}>
        {children}
      </a>
    );
  }
  return (
    <Link className="navbar__item navbar__link" to={to}>
      {children}
    </Link>
  );
}

function Rules(): ReactElement {
  return (
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
}

function Body(): ReactElement {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__items">
            <a className="navbar__brand" href="/">
              <img className="navbar__logo" src="/logo.png" alt="TEN App logo" />
              <strong className="navbar__title">TEN</strong>
            </a>
          </div>
          <div className="navbar__items navbar__items--right">
            <SSRLink to="/">Play against AI</SSRLink>
            <SSRLink to="/local">Play locally</SSRLink>
            <SSRLink to="/rules">Rules</SSRLink>
            <a className="navbar__item navbar__link" href="https://developersam.com">
              Home
            </a>
          </div>
        </div>
      </nav>
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
    </div>
  );
}

export default function App(): ReactElement {
  return __SERVER__ ? (
    <StaticRouter location="/">
      <Body />
    </StaticRouter>
  ) : (
    <BrowserRouter>
      <Body />
    </BrowserRouter>
  );
}
