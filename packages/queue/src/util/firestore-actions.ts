import { firestore } from 'firebase/app';
import { getAppUser } from 'lib-firebase/authentication';

import { QueueId, FirestoreQueue, FirestoreQuestion } from '../models/types';
import { queuesCollection, questionsCollection } from './firestore';

export const createNewQueue = (name: string): void => {
  const queue: FirestoreQueue = { owner: getAppUser().email, name };
  queuesCollection.add(queue);
};

export const createNewQuestion = (queueId: QueueId, content: string): void => {
  const question: FirestoreQuestion = {
    queueId,
    owner: getAppUser().email,
    content,
    answered: false,
    timestamp: firestore.Timestamp.fromDate(new Date()),
  };
  questionsCollection.add(question);
};
