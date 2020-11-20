export const isNotNull = <V>(value: V | null | undefined): value is V => value != null;

export function assertNotNull<V>(value: V | null | undefined): asserts value is V {
  if (value == null) {
    throw new Error(`Value is asserted to be not null, but it is ${value}.`);
  }
}

export const checkNotNull = <V>(value: V | null | undefined): V => {
  assertNotNull(value);
  return value;
};
