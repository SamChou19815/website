export type NominalString<T extends string> = string & { __nominalTag__: T };

export type UserEmail = NominalString<'EMAIL'>;

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
