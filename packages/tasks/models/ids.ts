import { NominalString } from './common-types';

export type TaskId = NominalString<'TaskId'>;

export const createTaskId = (id: string): TaskId => id as TaskId;
