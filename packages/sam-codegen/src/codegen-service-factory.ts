import * as TypeScript from 'typescript';

import type { CodegenServiceFileOutput, CodegenService } from './types';

export const createPlaintextCodegenService = (
  name: string,
  sourceFilesPattern: string | undefined,
  run: (sourceFilename: string, evaluatedSource: string) => readonly CodegenServiceFileOutput[]
): CodegenService<string> => ({
  name,
  sourceFilesPattern,
  generatedSourceEvaluator: (sourceString) => sourceString,
  run,
});

export const createPlaintextConcatenationCodegenService = (
  name: string,
  sourceFilesPattern: string | undefined,
  additionalContentsToConcatenate: readonly {
    readonly additionalContent: string;
    readonly outputFilename: string;
  }[]
): CodegenService<string> =>
  createPlaintextCodegenService(name, sourceFilesPattern, (_, evaluatedSource) =>
    additionalContentsToConcatenate.map(({ additionalContent, outputFilename }) => ({
      isOutputFileCodegenServiceManaged: true,
      outputRawContent: `${evaluatedSource}${additionalContent}`,
      outputFilename,
    }))
  );

export const createTypeScriptCodegenService = <T>(
  name: string,
  sourceFilesPattern: string | undefined,
  run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[]
): CodegenService<T> => ({
  name,
  sourceFilesPattern,
  generatedSourceEvaluator: (sourceString) => {
    const transpiledModuleCode = TypeScript.transpile(sourceString, {
      module: TypeScript.ModuleKind.CommonJS,
    });
    /*
     * TypeScript will emit code like: `exports.default = ...`. alone with other interop stuff.
     * Wrap the emitted code in an IIFE to avoid potentially pollute the global scope with eval.
     */
    const wrappedModuleCodeForEval = `((exports) => {
      ${transpiledModuleCode}

      return exports.default;
    })({})`;
    // eslint-disable-next-line no-eval
    return eval(wrappedModuleCodeForEval);
  },
  run,
});
