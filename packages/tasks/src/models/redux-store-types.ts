import { UserEmail } from './common-types';
import { ProjectId, TaskId } from './ids';

export type ReduxStoreProject = {
  readonly projectId: ProjectId;
  readonly owners: readonly UserEmail[];
  readonly isPublic: boolean;
  readonly isArchived: boolean;
  readonly name: string;
};

export type ReduxStoreTask = {
  readonly taskId: TaskId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
