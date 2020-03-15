import { UserEmail } from './common-types';
import { ProjectId, TaskId } from './ids';

export type FirestoreProject = {
  readonly owners: readonly UserEmail[];
  readonly isPublic: boolean;
  readonly isArchived: boolean;
  readonly name: string;
};

export type FirestoreTask = {
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
