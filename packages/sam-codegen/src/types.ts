export type CodegenServiceFileOutput = {
  /**
   * When set to false, it will be treated as a template file.
   * The file won't be overridden if something is already there.
   */
  readonly isOutputFileCodegenServiceManaged: boolean;
  /** Needed to output file and delete it when the source is gone */
  readonly outputFilename: string;
  /** Raw content with extra comments. The framework will handle it. */
  readonly outputRawContent: string;
};

export interface CodegenService<T> {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /** Optional file pattern of source file to help avoid scanning all files. */
  readonly sourceFilesPattern: string | undefined;
  /**
   * The raw source to be evaluated to an arbritrary JS object.
   * The implementation can be as simple as the identity function.
   * This is needed to ensure that we can run arbitrary JS code to get the information necessary for
   * codegen instead of parsing everything statically.
   */
  readonly generatedSourceEvaluator: (sourceString: string) => T;
  /** The main runner code. */
  readonly run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[];
}

/**
 * For the purpose of deterministic testing as well potentially virtualized filesystem, we need to
 * abstract out the filesystem actions.
 */
export interface CodegenFilesystem {
  readonly readFile: (filename: string) => string;
  readonly writeFile: (filename: string, content: string) => void;
  readonly deleteFile: (filename: string) => void;
}
