import baseCommands from './base-commands';

it('All commands have description', () => {
  Array.from(Object.values(baseCommands)).forEach((command) => {
    expect(command.description).toBeTruthy();
  });
});

it('commands does not crash', () => {
  baseCommands.cat.fn();
  baseCommands.cat.fn('README.md');
  baseCommands.cat.fn('ahhh!');
  baseCommands.cd.fn();
  baseCommands.cd.fn('top-secret');
  baseCommands.cd.fn('ahhh!');
  expect(baseCommands.echo.fn()).toBe('');
  expect(baseCommands.echo.fn('foo', 'bar')).toBe('foo bar');
  baseCommands.ls.fn();
  baseCommands.ls.fn('top-secret');
  baseCommands.ls.fn('ahh!!!');
  baseCommands.pwd.fn();
  baseCommands.pwd.fn('ahh!!!');
});
