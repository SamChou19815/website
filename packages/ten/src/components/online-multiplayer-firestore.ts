import { useState, useEffect } from 'react';

import firebase from 'firebase/app';

import { Board, emptyBoard, makeMoveWithoutCheck } from '../game/board';
import { getAppUser } from './authentication';

export type FirestoreOnlineGameData = {
  readonly gameID: string;
  readonly blackPlayerEmail: string;
  readonly whitePlayerEmail: string;
  readonly board: Board;
};

const gameDataCollection = firebase
  .firestore()
  .collection('ten-app-games')
  .withConverter<Omit<FirestoreOnlineGameData, 'gameID'>>({
    toFirestore(data: Omit<FirestoreOnlineGameData, 'gameID'>) {
      return data;
    },
    fromFirestore(snapshot) {
      return snapshot.data() as Omit<FirestoreOnlineGameData, 'gameID'>;
    },
  });

export const useFirestoreOnlineGameData = (
  gameID?: string
): FirestoreOnlineGameData | undefined => {
  const [gameData, setGameData] = useState<FirestoreOnlineGameData | undefined>();

  useEffect(() => {
    if (gameID == null) return () => {};
    return gameDataCollection.doc(gameID).onSnapshot((snapshot) => {
      const data = snapshot.data();
      setGameData(data == null ? undefined : { ...data, gameID });
    });
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
  };
  const document = gameDataCollection.doc();
  document.set(gameData);
  return { ...gameData, gameID: document.id };
};

export const makeMoveInFirestoreOnlineTENGame = (gameID: string, board: Board): void => {
  gameDataCollection.doc(gameID).update({ board });
};
