import { UserEmail, SanctionedColor } from './common-types';
import { ProjectId, TaskId } from './ids';

export type ReduxStoreProject = {
  readonly projectId: ProjectId;
  readonly owner: UserEmail;
  readonly isPublic: boolean;
  readonly name: string;
  readonly color: SanctionedColor;
};

export type ReduxStoreTask = {
  readonly taskId: TaskId;
  readonly owner: UserEmail;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};

export type ReduxStoreState = {
  readonly projects: readonly ReduxStoreProject[];
  readonly tasks: readonly ReduxStoreTask[];
};
