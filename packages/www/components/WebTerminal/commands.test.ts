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
  commands['dev-sam'].fn('about');
  commands['dev-sam'].fn('projects');
  commands['dev-sam'].fn('tech-talks');
  commands['dev-sam'].fn('timeline');
  commands['dev-sam'].fn('timeline', '--none');
  commands['dev-sam'].fn('timeline', '--only', 'work');
  commands['dev-sam'].fn('timeline', '--only', 'projects');
  commands['dev-sam'].fn('timeline', '--only', 'events');
  commands['dev-sam'].fn('timeline', '--only', 'random');
  commands['dev-sam'].fn('timeline', '--only');
  commands['dev-sam'].fn('timeline', 'bad command');
  commands['dev-sam'].fn('bad command');
});
