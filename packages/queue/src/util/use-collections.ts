import { useState, useEffect } from 'react';

import { firestore } from 'firebase/app';
import { getAppUser } from 'lib-firebase/authentication';
import { useSelector } from 'react-redux';

import {
  AppQuestion,
  AppQueue,
  QueueId,
  FirestoreQueue,
  FirestoreQuestion,
  QuestionId,
  ReduxStoreState,
} from '../models/types';
import { queuesCollection, questionsCollection } from './firestore';

type SnapshotDocument =
  | firestore.QueryDocumentSnapshot<firestore.DocumentData>
  | firestore.DocumentSnapshot<firestore.DocumentData>;

export const onQuerySnapshot = <T>(
  queryParameter: string,
  getQuery: (parameter: string) => firestore.Query,
  transformer: (document: SnapshotDocument) => T,
  onSnapshot: (results: T[]) => void
): (() => void) =>
  getQuery(queryParameter).onSnapshot((snapshot) => {
    onSnapshot(snapshot.docs.map(transformer));
  });

const queueQuery = () => queuesCollection.where('owner', '==', getAppUser().email);
const queueTransformer = (document: SnapshotDocument): AppQueue => ({
  queueId: document.id as QueueId,
  ...(document.data() as FirestoreQueue),
});
export const onQueueQuerySnapshot = (onSnapshot: (results: AppQueue[]) => void): void => {
  onQuerySnapshot('', queueQuery, queueTransformer, onSnapshot);
};

export const useSingleQueue = (queueId: QueueId): AppQueue | 'loading' | 'bad-queue' => {
  const [queueOptional, setQueueOptional] = useState<AppQueue | 'loading' | 'bad-queue'>(
    useSelector((state: ReduxStoreState) =>
      state.queues.find((queue) => queue.queueId === queueId)
    ) ?? 'loading'
  );

  useEffect(() => {
    queuesCollection.doc(queueId).onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setQueueOptional(queueTransformer(snapshot));
      } else {
        setQueueOptional('bad-queue');
      }
    });
  }, [queueId]);

  return queueOptional;
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
  const [questions, setQuestions] = useState<AppQuestion[] | null>(null);
  useEffect(() => {
    return onQuerySnapshot(queueId, questionsQuery, questionTransformer, setQuestions);
  }, [queueId]);
  if (questions === null) {
    return null;
  }
  return questions.sort(
    (question1, question2) => question1.timestamp.getTime() - question2.timestamp.getTime()
  );
};
