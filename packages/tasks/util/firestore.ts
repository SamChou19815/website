import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';

import { FirestoreTask, FirestoreTaskWithId } from '../models/firestore-types';

import { getAppUser } from 'lib-firebase/authentication';

const store = firestore();

export const createBatch = (): firestore.WriteBatch => store.batch();
export const runTransaction = <T>(
  updateFunction: (transaction: firestore.Transaction) => Promise<T>
): Promise<T> => store.runTransaction(updateFunction);

export const tasksCollection = store.collection('tasks-app-tasks');

type Update<T> = { readonly createdAndEdited: readonly T[]; readonly deleted: readonly string[] };

const createUpdate = <T>(
  snapshot: firestore.QuerySnapshot<firestore.DocumentData>,
  transformer: (document: firestore.QueryDocumentSnapshot<firestore.DocumentData>) => T
): Update<T> => {
  const createdAndEdited: T[] = [];
  const deleted: string[] = [];
  const changes = snapshot.docChanges();
  changes.forEach((change) => {
    switch (change.type) {
      case 'added':
      case 'modified':
        createdAndEdited.push(transformer(change.doc));
        break;
      case 'removed':
        deleted.push(change.doc.id);
        break;
      default:
        throw new Error();
    }
  });
  return { createdAndEdited, deleted };
};

export const getTasksObservable = (): Observable<Update<FirestoreTaskWithId>> =>
  new Observable((subscriber) => {
    const unsubscribe = tasksCollection
      .where('owner', '==', getAppUser().email)
      .onSnapshot((snapshot) => {
        subscriber.next(
          createUpdate(snapshot, (taskDocument) => ({
            taskId: taskDocument.id,
            ...(taskDocument.data() as FirestoreTask),
          }))
        );
      });
    return { unsubscribe };
  });
