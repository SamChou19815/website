export type CodegenServiceFileOutput = {
  /** Needed to output file and delete it when the source is gone */
  readonly outputFilename: string;
  /** Raw content with extra comments. The framework will handle it. */
  readonly outputContent: string;
};

export interface CodegenService {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /**
   * Used to abandon useless codegen attempts.
   * If it is not provided, it is interpreted that the codegen service will be run unconditionally.
   */
  readonly sourceFileIsRelevant?: (sourceFilename: string) => boolean;
  /** The main runner code. Unconditional codegen service will receive dummy inputs. */
  readonly run: (sourceFilename: string, source: string) => readonly CodegenServiceFileOutput[];
}

export const createJsonCodegenService = <T>(
  name: string,
  sourceFileIsRelevant: (sourceFilename: string) => boolean,
  run: (sourceFilename: string, json: T) => readonly CodegenServiceFileOutput[]
): CodegenService => ({
  name,
  sourceFileIsRelevant,
  run: (sourceFilename, source) => run(sourceFilename, JSON.parse(source)),
});
