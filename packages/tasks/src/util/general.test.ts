import { identity, ignore, error } from './general';

it('identity function works', () => {
  const object = { foo: 'bar' };
  expect(identity(object)).toBe(object);
});

it('ignore does not crash', () => ignore());

it('error always crash', () => {
  expect(() => error('')).toThrowError('');
  expect(() => error('ah')).toThrowError('ah');
});
