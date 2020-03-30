import { identity, ignore, error } from 'lib-common';

it('identity function works', () => {
  const object = { foo: 'bar' };
  expect(identity(object)).toBe(object);
});

it('ignore does not crash', () => ignore());

it('error always crash', () => {
  expect(() => error('')).toThrowError('');
  expect(() => error('ah')).toThrowError('ah');
});
