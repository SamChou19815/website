import React, { ReactElement, useState, useEffect } from 'react';

import OnlineGameCard from './OnlineGameCard';
import {
  startFirestoreOnlineTENGame,
  useFirestoreOnlineGameData,
} from './online-multiplayer-firestore';

import LoadingOverlay from 'lib-react/LoadingOverlay';

const getGameID = () =>
  location.hash.startsWith('#game-') ? location.hash.substring(6) : undefined;

export default function OnlineGameWrapper(): ReactElement {
  const [gameID, setGameID] = useState<string | undefined>(getGameID());

  const gameData = useFirestoreOnlineGameData(gameID);

  useEffect(() => {
    const handle = setInterval(() => {
      setGameID(getGameID());
    }, 50);
    () => clearInterval(handle);
  }, []);

  if (gameID == null) {
    return (
      <div className="card">
        <div className="card__header">Online Game</div>
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={() => {
              // eslint-disable-next-line no-alert
              const whitePlayerEmail = prompt("Your friend's email");
              if (whitePlayerEmail == null) return;
              startFirestoreOnlineTENGame(whitePlayerEmail);
            }}
          >
            Create a new game as black
          </button>
          <button
            className="button button--outline button--primary"
            onClick={() => {
              // eslint-disable-next-line no-alert
              const gameIDInput = prompt('Game ID');
              if (gameIDInput == null) return;
              location.hash = `game-${gameIDInput}`;
            }}
          >
            Join a game as white
          </button>
        </div>
      </div>
    );
  }

  if (gameData == null) {
    return <LoadingOverlay />;
  }

  return <OnlineGameCard gameData={gameData} />;
}
