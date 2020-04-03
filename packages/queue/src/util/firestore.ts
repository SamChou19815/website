import { firestore } from 'firebase/app';

const store = firestore();

export const createBatch = (): firestore.WriteBatch => store.batch();
export const runTransaction = <T>(
  updateFunction: (transaction: firestore.Transaction) => Promise<T>
): Promise<T> => store.runTransaction(updateFunction);

export const queuesCollection = store.collection('queue-app-queues');
export const questionsCollection = store.collection('queue-app-questions');
