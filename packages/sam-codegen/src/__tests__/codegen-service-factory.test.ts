import {
  createPlaintextConcatenationCodegenService,
  createTypeScriptCodegenService,
} from '../codegen-service-factory';

it('createPlaintextConcatenationCodegenService works', () => {
  const service = createPlaintextConcatenationCodegenService('', '', [
    { additionalContent: 'foo', outputFilename: 'foo.sam' },
    { additionalContent: 'bar', outputFilename: 'bar.sam' },
  ]);

  expect(service.run('', 'haha-')).toEqual([
    {
      isOutputFileCodegenServiceManaged: true,
      outputFilename: 'foo.sam',
      outputRawContent: 'haha-foo',
    },
    {
      isOutputFileCodegenServiceManaged: true,
      outputFilename: 'bar.sam',
      outputRawContent: 'haha-bar',
    },
  ]);
});

it('createTypeScriptCodegenService works', () => {
  const service = createTypeScriptCodegenService<() => number>('', '', () => []);

  // Test that
  // - type imports are fully erased.
  // - exports can be fully evaluated even if it's a function.
  expect(
    service.generatedSourceEvaluator('import type {Foo} from "bar"; export default () => 42')()
  ).toBe(42);
});
