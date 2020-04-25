import { FirestoreProject } from './firestore-types';
import { createProjectId } from './ids';
import { ReduxStoreProject } from './redux-store-types';

export const fromNewReduxStoreProject = ({
  owner,
  name,
  color,
}: Omit<ReduxStoreProject, 'projectId'>): FirestoreProject => ({
  owner,
  name,
  color,
});

export const toReduxStoreProject = ({
  projectId,
  owner,
  name,
  color,
}: FirestoreProject & { readonly projectId: string }): ReduxStoreProject => ({
  projectId: createProjectId(projectId),
  owner,
  name,
  color,
});
