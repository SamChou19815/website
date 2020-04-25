import { SanctionedColor } from './common-types';
import { TaskId } from './ids';

export type FirestoreTask = {
  readonly owner: string;
  readonly name: string;
  readonly color: SanctionedColor;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};
export type FirestoreTaskWithId = FirestoreTask & { readonly taskId: string };
