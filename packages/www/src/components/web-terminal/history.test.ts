import { expect, it } from 'mini-test';
import history from './history';

it('Trivial cases return null.', () => {
  expect(history('up', [], null)).toBeNull();
  expect(history('down', [], null)).toBeNull();
});

it('arrow up works.', () => {
  expect(history('up', ['foo', 'bar'], null)).toEqual({ value: 'foo', historyPosition: 0 });
  expect(history('up', ['foo', 'bar'], 0)).toEqual({ value: 'bar', historyPosition: 1 });
  expect(history('up', ['foo', 'bar'], 1)).toEqual({ value: 'bar', historyPosition: 1 });
});

it('arrow down works', () => {
  expect(history('down', ['foo', 'bar'], 1)).toEqual({ value: 'foo', historyPosition: 0 });
  expect(history('down', ['foo', 'bar'], 0)).toEqual({ value: '', historyPosition: null });
  expect(history('down', ['foo', 'bar'], null)).toEqual({ value: '', historyPosition: null });
});

it('history integration test', () => {
  const historyList = ['foo', 'bar'];
  const result = history(
    'down',
    historyList,
    history(
      'down',
      historyList,
      history(
        'down',
        historyList,
        history(
          'up',
          historyList,
          history('up', historyList, history('up', historyList, null)?.historyPosition ?? null)
            ?.historyPosition
        )?.historyPosition
      )?.historyPosition
    )?.historyPosition
  );
  expect(result?.historyPosition).toBeNull();
});
