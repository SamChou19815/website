type NominalString<T extends string> = string & { __nominalTag__: T };

export type QueueId = NominalString<'QueueId'>;
export type QuestionId = NominalString<'QueueId'>;

export type FirestoreQueue = {
  readonly owner: string;
  readonly name: string;
};
export type FirestoreQuestion = {
  readonly owner: string;
  readonly ownerName: string;
  readonly queueId: QueueId;
  readonly content: string;
  readonly answered: boolean;
  readonly timestamp: firebase.firestore.Timestamp;
};

export type AppQueue = FirestoreQueue & { readonly queueId: QueueId };
export type AppQuestion = Omit<FirestoreQuestion, 'timestamp'> & {
  readonly questionId: QuestionId;
  readonly timestamp: Date;
};

export type ReduxStoreState = {
  readonly dataLoaded: boolean;
  readonly queues: readonly AppQueue[];
};
