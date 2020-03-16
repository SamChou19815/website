import { FirestoreProject } from './firestore-types';
import { ReduxStoreProject } from './redux-store-types';
import { createProjectId } from './ids';

export const fromNewReduxStoreProject = ({
  owners,
  isPublic,
  name
}: ReduxStoreProject): FirestoreProject => ({
  owners,
  isPublic,
  name
});

export const fromPartialReduxStoreProject = ({
  owners,
  isPublic,
  name
}: Partial<ReduxStoreProject>): Partial<FirestoreProject> => ({
  owners,
  isPublic,
  name
});

export const toReduxStoreProject = ({
  projectId,
  owners,
  isPublic,
  name
}: FirestoreProject & { readonly projectId: string }): ReduxStoreProject => ({
  projectId: createProjectId(projectId),
  owners,
  isPublic,
  name
});
