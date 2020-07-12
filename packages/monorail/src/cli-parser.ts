const parseCommandLineArgumentsIntoCommand = (): 'CODEGEN' | 'REBUILD' | 'SYNC' => {
  const normalizedArguments: readonly string[] = process.argv.slice(2);

  if (normalizedArguments.length === 0) {
    return 'CODEGEN';
  }

  switch (normalizedArguments[0].toLowerCase()) {
    case 'codegen':
      return 'CODEGEN';
    case 'rebuild':
    case 'r':
      return 'REBUILD';
    case 'sync':
    case 's':
      return 'SYNC';
    default:
      throw new Error(`Unknown command: ${normalizedArguments[0]}`);
  }
};

export default parseCommandLineArgumentsIntoCommand;
