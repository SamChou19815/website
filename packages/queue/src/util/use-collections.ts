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

const useQueryWithLoading = <T>(
  queryParameter: string,
  getQuery: (parameter: string) => firestore.Query,
  transformer: (document: SnapshotDocument) => T
): T[] | null => {
  const [result, setResult] = useState<T[] | null>(null);
  useEffect(() => {
    return getQuery(queryParameter).onSnapshot((snapshot) => {
      setResult(snapshot.docs.map(transformer));
    });
  }, [queryParameter, getQuery, transformer]);
  return result;
};

const queueQuery = () => queuesCollection.where('owner', '==', getAppUser().email);
const queueTransformer = (document: SnapshotDocument): AppQueue => ({
  queueId: document.id as QueueId,
  ...(document.data() as FirestoreQueue),
});
export const useQueues = (): readonly AppQueue[] | null =>
  useQueryWithLoading('', queueQuery, queueTransformer);

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
