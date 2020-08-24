export type CodegenServiceFileOutput = {
  readonly outputFilename: string;
  /** Raw content with extra comments. The framework will handle it. */
  readonly outputRawContent: string;
};

export interface CodegenService<T> {
  /** Name of the codegen service. Doesn't affect codegen results but useful for readable output. */
  readonly name: string;
  /** Optional file pattern of source file to help avoid scanning all files. */
  readonly sourceFilesPattern?: string;
  /** The main runner code. */
  readonly run: (sourceFilename: string, evaluatedSource: T) => readonly CodegenServiceFileOutput[];
}
