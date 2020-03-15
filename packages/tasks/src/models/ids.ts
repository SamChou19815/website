import { NominalString } from './common-types';

export type ProjectId = NominalString<'ProjectId'>;
export type TaskId = NominalString<'TaskId'>;

export const createProjectId = (id: string): ProjectId => id as ProjectId;
export const createTaskId = (id: string): TaskId => id as TaskId;
