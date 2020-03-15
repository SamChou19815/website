import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  FirestoreProject,
  FirestoreProjectWithId,
  FirestoreTask,
  FirestoreTaskWithId,
  AllFirestoreUserData
} from '../models/firestore-types';
import { getAppUser } from './authentication';

const store = firestore();

export const batch = (): firestore.WriteBatch => store.batch();
export const transaction = <T>(
  updateFunction: (transaction: firestore.Transaction) => Promise<T>
): Promise<T> => store.runTransaction(updateFunction);

export const projectsCollection = store.collection('tasks-app-projects');
export const tasksCollection = store.collection('tasks-app-tasks');

const getProjectsObservable = (): Observable<readonly FirestoreProjectWithId[]> =>
  new Observable(subscriber => {
    const unsubscribe = projectsCollection
      .where('owners', 'array-contains', getAppUser().email)
      .onSnapshot(snapshot => {
        const projects: FirestoreProjectWithId[] = snapshot.docs.map(projectDocument => ({
          projectId: projectDocument.id,
          ...(projectDocument.data() as FirestoreProject)
        }));
        subscriber.next(projects);
      });
    return { unsubscribe };
  });

const getTasksObservable = (
  projectIds: readonly string[]
): Observable<readonly FirestoreTaskWithId[]> =>
  new Observable(subscriber => {
    const unsubscribe = tasksCollection
      .where('projectId', 'in', projectIds)
      .onSnapshot(snapshot => {
        const tasks: FirestoreTaskWithId[] = snapshot.docs.map(taskDocument => ({
          taskId: taskDocument.id,
          ...(taskDocument.data() as FirestoreTask)
        }));
        subscriber.next(tasks);
      });
    return { unsubscribe };
  });

export const getRootObservable = (): Observable<AllFirestoreUserData> =>
  getProjectsObservable().pipe(
    switchMap(projects => {
      const projectIds = projects.map(project => project.projectId);
      if (projectIds.length === 0) {
        return new Observable<AllFirestoreUserData>(subscriber =>
          subscriber.next({ projects, tasks: [] })
        );
      }
      return getTasksObservable(projectIds).pipe(map(tasks => ({ projects, tasks })));
    })
  );
