import { UserEmail } from './common-types';
import { ProjectId, TaskId } from './ids';

export type FirestoreProject = {
  readonly owners: readonly UserEmail[];
  readonly isPublic: boolean;
  readonly name: string;
};
export type FirestoreProjectWithId = FirestoreProject & { readonly projectId: string };

export type FirestoreTask = {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
export type FirestoreTaskWithId = FirestoreTask & { readonly taskId: string };

export type AllFirestoreUserData = {
  readonly projects: readonly FirestoreProjectWithId[];
  readonly tasks: readonly FirestoreTaskWithId[];
};
