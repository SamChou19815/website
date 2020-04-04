import { firestore } from 'firebase/app';
import { getAppUser } from 'lib-firebase/authentication';

import { QueueId, FirestoreQueue, FirestoreQuestion, QuestionId } from '../models/types';
import { queuesCollection, questionsCollection, createBatch } from './firestore';

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

export const editQueue = (queueId: QueueId, update: Partial<FirestoreQueue>): void => {
  queuesCollection.doc(queueId).update(update);
};

export const editQuestion = (questionId: QuestionId, update: Partial<FirestoreQuestion>): void => {
  questionsCollection.doc(questionId).update(update);
};

export const deleteQueue = (queueId: QueueId): void => {
  questionsCollection
    .where('queueId', '==', queueId)
    .get()
    .then((documents) => {
      const batch = createBatch();
      batch.delete(queuesCollection.doc(queueId));
      documents.docs.forEach((document) => batch.delete(questionsCollection.doc(document.id)));
      batch.commit();
    });
};

export const deleteQuestion = (questionId: QuestionId): void => {
  questionsCollection.doc(questionId).delete();
};
