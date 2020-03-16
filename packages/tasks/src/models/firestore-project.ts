import { FirestoreProject } from './firestore-types';
import { ReduxStoreProject } from './redux-store-types';
import { createProjectId } from './ids';

export const fromNewReduxStoreProject = ({
  owners,
  isPublic,
  name,
  color
}: ReduxStoreProject): FirestoreProject => ({
  owners,
  isPublic,
  name,
  color
});

export const fromPartialReduxStoreProject = ({
  owners,
  isPublic,
  name,
  color
}: Partial<ReduxStoreProject>): Partial<FirestoreProject> => ({
  owners,
  isPublic,
  name,
  color
});

export const toReduxStoreProject = ({
  projectId,
  owners,
  isPublic,
  name,
  color
}: FirestoreProject & { readonly projectId: string }): ReduxStoreProject => ({
  projectId: createProjectId(projectId),
  owners,
  isPublic,
  name,
  color
});
