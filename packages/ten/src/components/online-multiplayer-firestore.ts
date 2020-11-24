import { useState, useEffect } from 'react';

import firebase from 'firebase/app';

import { Board, emptyBoard, makeMoveWithoutCheck } from '../game/board';
import { getAppUser } from './authentication';

export type FirestoreOnlineGameData = {
  readonly blackPlayerEmail: string;
  readonly whitePlayerEmail: string;
  readonly board: Board;
  readonly moveIndex: number;
};

const gameDataCollection = firebase
  .firestore()
  .collection('ten-app-games')
  .withConverter<FirestoreOnlineGameData>({
    toFirestore(data: FirestoreOnlineGameData) {
      return data;
    },
    fromFirestore(snapshot) {
      return snapshot.data() as FirestoreOnlineGameData;
    },
  });

export const useFirestoreOnlineGameData = (gameID: string): FirestoreOnlineGameData | undefined => {
  const [gameData, setGameData] = useState<FirestoreOnlineGameData | undefined>();

  useEffect(() => {
    return gameDataCollection.doc(gameID).onSnapshot((snapshot) => setGameData(snapshot.data()));
  }, [gameID]);

  return gameData;
};

/** Start a game as black. */
export const startFirestoreOnlineTENGame = (
  whitePlayerEmail: string
): FirestoreOnlineGameData & { readonly gameID: string } => {
  const blackPlayerEmail = getAppUser().email;
  const gameData = {
    blackPlayerEmail,
    whitePlayerEmail,
    board: makeMoveWithoutCheck(emptyBoard, [4, 4]),
    moveIndex: 0,
  };
  const document = gameDataCollection.doc();
  document.set(gameData);
  return { ...gameData, gameID: document.id };
};
