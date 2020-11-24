import React, { ReactElement, useState, useEffect, useRef } from 'react';

import firebase from 'firebase/app';

import { Move, Board, emptyBoard, makeMoveWithoutCheck } from '../game/board';
import type { GameState } from '../game/game-state';
import GameCardWithLogic from './GameCardWithLogic';

import LoadingOverlay from 'lib-react/LoadingOverlay';

type FirestoreGameData = {
  readonly board: Board;
  readonly move: Move;
  readonly moveIndex: number;
};

const gameDataCollection = firebase
  .firestore()
  .collection('ten-app-games')
  .withConverter<FirestoreGameData>({
    toFirestore(data: FirestoreGameData) {
      return data;
    },
    fromFirestore(snapshot) {
      return snapshot.data() as FirestoreGameData;
    },
  });

const getGameID = () => (location.hash.startsWith('#game-') ? location.hash.substring(6) : null);

export default function OnlineGameCard(): ReactElement {
  const [gameID, setGameID] = useState<string | null>(getGameID());
  const [initialBoard, setInitialBoard] = useState<Board | undefined>();
  const resolveOtherPlayerMoveRef = useRef<{
    resolver?: (board: Board, move: Move) => void;
    moveIndex: number;
  }>({ moveIndex: -1 });

  useEffect(() => {
    const handle = setInterval(() => {
      setGameID(getGameID());
    }, 50);
    () => clearInterval(handle);
  }, []);

  useEffect(() => {
    if (gameID == null) return () => {};
    return gameDataCollection.doc(gameID).onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (data == null) {
        // eslint-disable-next-line no-alert
        alert('Invalid game ID!');
        return;
      }
      setInitialBoard(data.board);
      if (resolveOtherPlayerMoveRef.current.moveIndex === data.moveIndex) return;
      resolveOtherPlayerMoveRef.current.resolver?.(data.board, data.move);
    });
  }, [gameID]);

  if (gameID === null) {
    return (
      <div className="card">
        <div className="card__header">Online Game</div>
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={() => {
              const gameData = {
                board: makeMoveWithoutCheck(emptyBoard, [4, 4]),
                move: [4, 4],
                moveIndex: 0,
              } as const;
              const document = gameDataCollection.doc();
              resolveOtherPlayerMoveRef.current.moveIndex = 0;
              document.set(gameData);
              location.hash = `game-${document.id}`;
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

  if (initialBoard == null) {
    return <LoadingOverlay />;
  }

  const otherPlayerResponder = (board: Board, move: Move): Promise<GameState> => {
    resolveOtherPlayerMoveRef.current.moveIndex += 1;
    gameDataCollection
      .doc(gameID)
      .set({ board, move, moveIndex: resolveOtherPlayerMoveRef.current.moveIndex });
    return new Promise((resolve) => {
      resolveOtherPlayerMoveRef.current.resolver = (newBoardAfterAI) => {
        resolve({ board: newBoardAfterAI });
        resolveOtherPlayerMoveRef.current.resolver = undefined;
      };
    });
  };

  return (
    <GameCardWithLogic initialBoard={initialBoard} otherPlayerResponder={otherPlayerResponder} />
  );
}
