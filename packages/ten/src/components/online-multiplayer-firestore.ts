import {
  FirestoreDataConverter,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { getAppUser } from 'lib-firebase/authentication';
import firestore from 'lib-firebase/database';
import { useState, useEffect } from 'react';

import { Board, emptyBoard } from '../game/board';

export type FirestoreOnlineGameData = {
  readonly gameID: string;
  readonly blackPlayerEmail: string;
  readonly whitePlayerEmail: string;
  readonly board: Board;
};

const converter: FirestoreDataConverter<Omit<FirestoreOnlineGameData, 'gameID'>> = {
  toFirestore(data: Omit<FirestoreOnlineGameData, 'gameID'>) {
    return data;
  },
  fromFirestore(snapshot) {
    return snapshot.data() as Omit<FirestoreOnlineGameData, 'gameID'>;
  },
};

const gameDataCollection = collection(firestore, 'ten-app-games').withConverter(converter);

const gameDoc = (gameID?: string) =>
  gameID == null
    ? doc(gameDataCollection).withConverter(converter)
    : doc(gameDataCollection, gameID).withConverter(converter);

export const useFirestoreOnlineGameData = (
  gameID?: string
): FirestoreOnlineGameData | undefined => {
  const [gameData, setGameData] = useState<FirestoreOnlineGameData | undefined>();

  useEffect(() => {
    if (gameID == null) return () => {};
    return onSnapshot(gameDoc(gameID), (snapshot) => {
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
    board: emptyBoard,
  };
  const document = gameDoc();
  setDoc(document, gameData);
  return { ...gameData, gameID: document.id };
};

export const makeMoveInFirestoreOnlineTENGame = (gameID: string, board: Board): void => {
  updateDoc(gameDoc(gameID), { board });
};
