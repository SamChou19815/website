import { UserEmail, SanctionedColor } from './common-types';
import { ProjectId, TaskId } from './ids';

export type FirestoreProject = {
  readonly owner: UserEmail;
  readonly isPublic: boolean;
  readonly name: string;
  readonly color: SanctionedColor;
};
export type FirestoreProjectWithId = FirestoreProject & { readonly projectId: string };

export type FirestoreTask = {
  readonly owner: UserEmail;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
export type FirestoreTaskWithId = FirestoreTask & { readonly taskId: string };
