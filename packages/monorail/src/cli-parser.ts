const parseCommandLineArgumentsIntoCommand = ():
  | 'CODEGEN'
  | 'COMPILE'
  | 'NO_CHANGED'
  | 'REBUILD'
  | 'SYNC' => {
  const normalizedArguments: readonly string[] = process.argv.slice(2);

  if (normalizedArguments.length === 0) {
    return 'CODEGEN';
  }

  switch (normalizedArguments[0].toLowerCase()) {
    case 'codegen':
      return 'CODEGEN';
    case 'compile':
    case 'c':
      return 'COMPILE';
    case 'no-changed':
    case 'nc':
      return 'NO_CHANGED';
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
