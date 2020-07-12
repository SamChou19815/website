export const assertIsString = (key: string, json?: unknown): string => {
  if (typeof json !== 'string') {
    throw new Error(`Expect '${key}' to be a string!`);
  }
  return json;
};

export const assertIsStringArray = (
  key: string,
  json?: unknown,
  allowUndefined = false
): readonly string[] => {
  if (allowUndefined && json == null) {
    return [];
  }
  if (json == null || !Array.isArray(json)) {
    throw new Error(`Expect '${key}' to be a string array!`);
  }
  const elements = json.filter((it): it is string => typeof it === 'string');
  if (elements.length !== json.length) {
    throw new Error(`Expect '${key}' to be a string array!`);
  }
  return elements;
};

export const assertHasFields = <S extends string>(
  key: string,
  requiredFields: S[],
  json?: unknown
): Readonly<Record<S, unknown>> => {
  if (json == null) {
    throw new Error(`Expect '${key}' to be an object, but got undefined or null!`);
  }
  if (typeof json !== 'object') {
    throw new Error(`Expect '${key}' to be an object, but got ${typeof json}!`);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error: S must be string!
  const record: Record<S, unknown> = {};
  const missingFields = requiredFields.filter((requiredKey) => {
    const value = (json as Record<string, unknown>)[requiredKey];
    if (value != null) {
      record[requiredKey] = value;
    }
    return value == null;
  });
  if (missingFields.length > 0) {
    throw new Error(`'${key}' has missing fields: [${missingFields.join(', ')}]`);
  }
  return record;
};
