export type NominalString<T extends string> = string & { __nominalTag__: T };

export type UserEmail = NominalString<'EMAIL'>;
