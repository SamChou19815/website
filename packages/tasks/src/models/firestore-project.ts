import { FirestoreProject } from './firestore-types';
import { createProjectId } from './ids';
import { ReduxStoreProject } from './redux-store-types';

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
