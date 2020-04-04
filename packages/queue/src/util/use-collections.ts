import { useState, useEffect } from 'react';

import { firestore } from 'firebase/app';
import { getAppUser } from 'lib-firebase/authentication';

import {
  AppQuestion,
  AppQueue,
  QueueId,
  FirestoreQueue,
  FirestoreQuestion,
  QuestionId,
} from '../models/types';
import { queuesCollection, questionsCollection } from './firestore';

type SnapshotDocument = firestore.QueryDocumentSnapshot<firestore.DocumentData>;

export const onQuerySnapshot = <T>(
  queryParameter: string,
  getQuery: (parameter: string) => firestore.Query,
  transformer: (document: SnapshotDocument) => T,
  onSnapshot: (results: T[]) => void
): (() => void) =>
  getQuery(queryParameter).onSnapshot((snapshot) => {
    onSnapshot(snapshot.docs.map(transformer));
  });

const useQueryWithLoading = <T>(
  queryParameter: string,
  getQuery: (parameter: string) => firestore.Query,
  transformer: (document: SnapshotDocument) => T
): T[] | null => {
  const [result, setResult] = useState<T[] | null>(null);
  useEffect(() => {
    return onQuerySnapshot(queryParameter, getQuery, transformer, setResult);
  }, [queryParameter, getQuery, transformer]);
  return result;
};

const queueQuery = () => queuesCollection.where('owner', '==', getAppUser().email);
const queueTransformer = (document: SnapshotDocument): AppQueue => ({
  queueId: document.id as QueueId,
  ...(document.data() as FirestoreQueue),
});
export const onQueueQuerySnapshot = (onSnapshot: (results: AppQueue[]) => void): void => {
  onQuerySnapshot('', queueQuery, queueTransformer, onSnapshot);
};

const questionsQuery = (queueId: string) => questionsCollection.where('queueId', '==', queueId);
const questionTransformer = (document: SnapshotDocument): AppQuestion => {
  const { timestamp, ...rest } = document.data() as FirestoreQuestion;
  return {
    questionId: document.id as QuestionId,
    timestamp: timestamp.toDate(),
    ...rest,
  };
};
export const useQuestions = (queueId: string): readonly AppQuestion[] | null => {
  const questions = useQueryWithLoading(queueId, questionsQuery, questionTransformer);
  if (questions === null) {
    return null;
  }
  return questions.sort(
    (question1, question2) => question1.timestamp.getTime() - question2.timestamp.getTime()
  );
};
