import React, { ReactElement, useState, useEffect } from 'react';

import GameCardWithLogic from './GameCardWithLogic';

import LoadingOverlay from 'lib-react/LoadingOverlay';

const App = (): ReactElement => {
  const [gameID, setGameID] = useState<string | null | undefined>();

  useEffect(() => {
    const handle = setInterval(() => {
      setGameID(location.hash.startsWith('#game-') ? location.hash.substring(6) : null);
    }, 50);
    () => clearInterval(handle);
  });

  if (gameID === undefined) {
    return <LoadingOverlay />;
  }
  if (gameID === null) {
    <div className="card">
      <div className="card__header">Online Game</div>
      <div className="card__footer">
        <button className="button button--outline button--primary">Create a new game</button>
        <button className="button button--outline button--primary">Join a game</button>
      </div>
    </div>;
  }

  return <GameCardWithLogic />;
};

export default App;
