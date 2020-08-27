import { createJsonCodegenService, createJSCodegenService } from '.';

it('createJsonCodegenService works', () => {
  const service = createJsonCodegenService<{ foo: string }>(
    '',
    () => true,
    (_, json) => [{ outputFilename: '', outputContent: json.foo }]
  );
  expect(service.run('', '{"foo":"bar"}')[0].outputContent).toBe('bar');
});

it('createJSCodegenService works', () => {
  const service = createJSCodegenService<() => number>(
    '',
    () => true,
    (_, f) => [{ outputFilename: '', outputContent: String(f()) }]
  );

  expect(service.run('', 'exports = () => 42;')[0].outputContent).toBe('42');
});
