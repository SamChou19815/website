import { FirestoreProject } from './firestore-types';
import { ReduxStoreProject } from './redux-store-types';
import { createProjectId } from './ids';

export const fromNewReduxStoreProject = ({
  owners,
  isPublic,
  isArchived,
  name
}: ReduxStoreProject): FirestoreProject => ({
  owners,
  isPublic,
  isArchived,
  name
});

export const fromPartialReduxStoreProject = ({
  owners,
  isPublic,
  isArchived,
  name
}: Partial<ReduxStoreProject>): Partial<FirestoreProject> => ({
  owners,
  isPublic,
  isArchived,
  name
});

export const toReduxStoreProject = (
  projectId: string,
  { owners, isPublic, isArchived, name }: FirestoreProject
): ReduxStoreProject => ({
  projectId: createProjectId(projectId),
  owners,
  isPublic,
  isArchived,
  name
});
