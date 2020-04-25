import { SanctionedColor } from './common-types';
import { ProjectId, TaskId } from './ids';

export type FirestoreProject = {
  readonly owner: string;
  readonly name: string;
  readonly color: SanctionedColor;
};
export type FirestoreProjectWithId = FirestoreProject & { readonly projectId: string };

export type FirestoreTask = {
  readonly owner: string;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
export type FirestoreTaskWithId = FirestoreTask & { readonly taskId: string };
