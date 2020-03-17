import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import {
  FirestoreProject,
  FirestoreProjectWithId,
  FirestoreTask,
  FirestoreTaskWithId
} from '../models/firestore-types';
import { getAppUser } from './authentication';

const store = firestore();

export const createBatch = (): firestore.WriteBatch => store.batch();
export const runTransaction = <T>(
  updateFunction: (transaction: firestore.Transaction) => Promise<T>
): Promise<T> => store.runTransaction(updateFunction);

export const projectsCollection = store.collection('tasks-app-projects');
export const tasksCollection = store.collection('tasks-app-tasks');

export const getProjectsObservable = (): Observable<readonly FirestoreProjectWithId[]> =>
  new Observable(subscriber => {
    const unsubscribe = projectsCollection
      .where('owner', '==', getAppUser().email)
      .onSnapshot(snapshot => {
        const projects: FirestoreProjectWithId[] = snapshot.docs.map(projectDocument => ({
          projectId: projectDocument.id,
          ...(projectDocument.data() as FirestoreProject)
        }));
        subscriber.next(projects);
      });
    return { unsubscribe };
  });

export const getTasksObservable = (): Observable<readonly FirestoreTaskWithId[]> =>
  new Observable(subscriber => {
    const unsubscribe = tasksCollection
      .where('owner', '==', getAppUser().email)
      .onSnapshot(snapshot => {
        const tasks: FirestoreTaskWithId[] = snapshot.docs.map(taskDocument => ({
          taskId: taskDocument.id,
          ...(taskDocument.data() as FirestoreTask)
        }));
        subscriber.next(tasks);
      });
    return { unsubscribe };
  });
