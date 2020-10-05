import history from './history';

it('Trivial cases return null.', () => {
  expect(history('up', [], null)).toBeNull();
  expect(history('down', [], null)).toBeNull();
});

it('arrow up works.', () => {
  expect(history('up', ['foo', 'bar'], null)).toStrictEqual({ value: 'foo', historyPosition: 0 });
  expect(history('up', ['foo', 'bar'], 0)).toStrictEqual({ value: 'bar', historyPosition: 1 });
  expect(history('up', ['foo', 'bar'], 1)).toStrictEqual({ value: 'bar', historyPosition: 1 });
});

it('arrow down works', () => {
  expect(history('down', ['foo', 'bar'], 1)).toStrictEqual({ value: 'foo', historyPosition: 0 });
  expect(history('down', ['foo', 'bar'], 0)).toStrictEqual({ value: '', historyPosition: null });
  expect(history('down', ['foo', 'bar'], null)).toStrictEqual({ value: '', historyPosition: null });
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
