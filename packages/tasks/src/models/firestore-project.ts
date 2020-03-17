import { FirestoreProject } from './firestore-types';
import { ReduxStoreProject } from './redux-store-types';
import { createProjectId } from './ids';

export const fromNewReduxStoreProject = ({
  owner,
  isPublic,
  name,
  color
}: Omit<ReduxStoreProject, 'projectId'>): FirestoreProject => ({
  owner,
  isPublic,
  name,
  color
});

export const fromPartialReduxStoreProject = ({
  owner,
  isPublic,
  name,
  color
}: Partial<ReduxStoreProject>): Partial<FirestoreProject> => ({
  owner,
  isPublic,
  name,
  color
});

export const toReduxStoreProject = ({
  projectId,
  owner,
  isPublic,
  name,
  color
}: FirestoreProject & { readonly projectId: string }): ReduxStoreProject => ({
  projectId: createProjectId(projectId),
  owner,
  isPublic,
  name,
  color
});
