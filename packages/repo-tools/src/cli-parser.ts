const normalizedArguments: readonly string[] = process.argv.slice(2);

type MutableRawOptions = {
  readonly presented: Set<string>;
  readonly keyValuePairs: Map<string, string>;
};

const parseArgumentsToRawOptions = (zeroIndexedArguments: readonly string[]): MutableRawOptions => {
  const rawOptions: MutableRawOptions = {
    presented: new Set(),
    keyValuePairs: new Map(),
  };
  let lastOption: string | null = null;
  zeroIndexedArguments.forEach((argument) => {
    if (!argument.startsWith('--')) {
      if (lastOption === null) {
        throw new Error(`Invalid option key ${argument}. Option key must start with --.`);
      } else {
        rawOptions.keyValuePairs.set(lastOption, argument);
        lastOption = null;
      }
      return;
    }
    const optionName = argument.substring(2);
    if (lastOption === null) {
      lastOption = optionName;
    } else {
      rawOptions.presented.add(lastOption);
      lastOption = optionName;
    }
  });
  if (lastOption !== null) {
    rawOptions.presented.add(lastOption);
  }
  return rawOptions;
};

type CommandLineCommand =
  | { readonly type: 'CODEGEN' }
  | { readonly type: 'SYNC'; readonly target: string };

const parseCommandLineArgumentsIntoCommand = (
  zeroIndexedArguments: readonly string[] = normalizedArguments
): CommandLineCommand => {
  if (zeroIndexedArguments.length === 0) {
    return { type: 'CODEGEN' };
  }

  const command = zeroIndexedArguments[0];
  const { keyValuePairs } = parseArgumentsToRawOptions(zeroIndexedArguments.slice(1));

  switch (command) {
    case 'codegen':
      return { type: 'CODEGEN' };
    case 'sync': {
      const target = keyValuePairs.get('target');
      if (typeof target !== 'string') {
        throw new Error('Target to sync is not specified.');
      }
      return { type: 'SYNC', target };
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

export default parseCommandLineArgumentsIntoCommand;
