export type NominalString<T extends string> = string & { __nominalTag__: T };

export type TaskStatus = 'backlogged' | 'to-do' | 'in-progress' | 'done';

export type SanctionedColor =
  | 'Red'
  | 'Pink'
  | 'Purple'
  | 'Indigo'
  | 'Blue'
  | 'Teal'
  | 'Green'
  | 'Light Green'
  | 'Orange'
  | 'Gray';
