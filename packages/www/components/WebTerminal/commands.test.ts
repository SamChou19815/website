import commands from './commands';

it('All commands have description', () => {
  Array.from(Object.values(commands)).forEach((command) => {
    expect(command.description).toBeTruthy();
  });
});

it('commands does not crash', () => {
  commands.help.fn();
  commands.cat.fn();
  commands.cat.fn('README.md');
  commands.cat.fn('ahhh!');
  commands.cd.fn();
  commands.cd.fn('top-secret');
  commands.cd.fn('ahhh!');
  commands['dev-sam'].fn();
  expect(commands.echo.fn()).toBe('');
  expect(commands.echo.fn('foo', 'bar')).toBe('foo bar');
  commands.ls.fn();
  commands.ls.fn('top-secret');
  commands.ls.fn('ahh!!!');
  commands.pwd.fn();
  commands.pwd.fn('ahh!!!');
  commands.timeline.fn();
  commands.timeline.fn('--none');
  commands.timeline.fn('--only', 'work');
  commands.timeline.fn('--only', 'projects');
  commands.timeline.fn('--only', 'events');
  commands.timeline.fn('--only', 'random');
  commands.timeline.fn('--only');
  commands.timeline.fn('bad command');
});
