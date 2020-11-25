import React, { ReactElement, useState } from 'react';

import { getGameStatus, makeMove } from '../game/board';
import GameCard from './GameCard';
import { getAppUser } from './authentication';
import {
  FirestoreOnlineGameData,
  makeMoveInFirestoreOnlineTENGame,
} from './online-multiplayer-firestore';

type Props = { readonly gameData: FirestoreOnlineGameData };

export default function OnlineGameCard({ gameData }: Props): ReactElement {
  const [playerMadeIllegalMove, setPlayerMadeIllegalMove] = useState(false);

  const playerIdentity = gameData.blackPlayerEmail === getAppUser().email ? 'Black' : 'White';
  const boardIdentity = gameData.board.playerIdentity === 1 ? 'Black' : 'White';

  const clickCallback = (a: number, b: number) => {
    const newBoard = makeMove(gameData.board, [a, b]);
    if (newBoard === null) {
      setPlayerMadeIllegalMove(true);
      return;
    }
    setPlayerMadeIllegalMove(false);
    makeMoveInFirestoreOnlineTENGame(gameData.gameID, newBoard);
  };

  return (
    <GameCard
      gameState={{ board: gameData.board }}
      playerIdentity={playerIdentity}
      playerCanMove={playerIdentity === boardIdentity && getGameStatus(gameData.board) === 0}
      playerMadeIllegalMove={playerMadeIllegalMove}
      showUndoButton={false}
      clickCallback={clickCallback}
    />
  );
}
