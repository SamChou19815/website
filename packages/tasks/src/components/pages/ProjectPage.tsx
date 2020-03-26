import React, { ReactElement, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { toReduxStoreProject } from '../../models/firestore-project';
import { toReduxStoreTask } from '../../models/firestore-task';
import { FirestoreProject, FirestoreTask } from '../../models/firestore-types';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask, ReduxStoreProject } from '../../models/redux-store-types';
import { projectsCollection, tasksCollection } from '../../util/firestore';
import ProjectPageWithContent from '../includes/ProjectPageWithContent';
import LoadingPage from './LoadingPage';
import UnauthorizedPage from './UnauthorizedPage';
import { RouteComponentsWithProjectIdParameter } from './router-types';

type LoadedData = {
  readonly project: ReduxStoreProject;
  readonly tasks: readonly ReduxStoreTask[];
};
type PartialLoadedData = {
  readonly project: ReduxStoreProject | null;
  readonly tasks: readonly ReduxStoreTask[] | null;
};
type State = LoadedData | 'loading' | 'unauthorized';

const getProjectsObservable = (projectId: string): Observable<ReduxStoreProject | null> =>
  new Observable((subscriber) => {
    const unsubscribe = projectsCollection.doc(projectId).onSnapshot(
      (projectDocument) => {
        const firestoreProject = {
          projectId: projectDocument.id,
          ...(projectDocument.data() as FirestoreProject),
        };
        subscriber.next(toReduxStoreProject(firestoreProject));
      },
      () => subscriber.next(null)
    );
    return { unsubscribe };
  });

const getTasksObservable = (projectId: string): Observable<readonly ReduxStoreTask[] | null> =>
  new Observable((subscriber) => {
    const unsubscribe = tasksCollection.where('projectId', '==', projectId).onSnapshot(
      (snapshot) => {
        const tasks = snapshot.docs
          .map((taskDocument) => ({
            taskId: taskDocument.id,
            ...(taskDocument.data() as FirestoreTask),
          }))
          .map(toReduxStoreTask);
        subscriber.next(tasks);
      },
      () => subscriber.next(null)
    );
    return { unsubscribe };
  });

const getLoadedDataObservable = (projectId: string): Observable<PartialLoadedData> =>
  zip(getProjectsObservable(projectId), getTasksObservable(projectId)).pipe(
    map(([project, tasks]) => ({ project, tasks }))
  );

export default ({
  match: {
    params: { projectId },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const userProjectAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    const tasks = flattenedTopologicalSort(
      Object.values(state.tasks).filter((task) => task.projectId === projectId)
    );
    return [state.projects[projectId], tasks] as const;
  });

  const [publicProjectAndTasks, setPublicProjectAndTasks] = useState<State>('loading');

  useEffect(() => {
    if (userProjectAndTasks !== null) {
      return;
    }
    getLoadedDataObservable(projectId).subscribe(({ project, tasks }) => {
      if (project === null || tasks === null) {
        setPublicProjectAndTasks('unauthorized');
      } else {
        setPublicProjectAndTasks({ project, tasks });
      }
    });
  }, [userProjectAndTasks, projectId]);

  if (userProjectAndTasks === null) {
    if (publicProjectAndTasks === 'loading') {
      return <LoadingPage />;
    }
    if (publicProjectAndTasks === 'unauthorized') {
      return <UnauthorizedPage />;
    }
    const { project, tasks } = publicProjectAndTasks;
    return <ProjectPageWithContent writable={false} project={project} tasks={tasks} />;
  }
  const [project, tasks] = userProjectAndTasks;

  return <ProjectPageWithContent writable project={project} tasks={tasks} />;
};
