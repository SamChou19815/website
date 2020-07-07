export type CodegenResult = {
  readonly pathForGeneratedCode: string;
  readonly generatedCode: string;
};

export type CodegenService = {
  /** Name of the codegen service. Used for display only. */
  readonly serviceName: string;
  /**
   * Pattern for the list of filenames that generated files.
   * Used to remove stale files.
   * If this field is not specified, it is assumed that the list of generated filenames
   * will be very static, so no file removal cleanup will be done.
   */
  readonly generatedFilenamePattern?: string;
  /** A list of generated code results. */
  readonly generatedCodeContentList: readonly CodegenResult[];
};
