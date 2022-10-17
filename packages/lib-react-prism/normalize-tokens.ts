// Forked from: https://github.com/FormidableLabs/prism-react-renderer

export type PrismToken = {
  readonly type: readonly string[] | string;
  readonly alias: readonly string[] | string;
  readonly content: readonly (PrismToken | string)[] | string;
};

export type Token = {
  readonly types: readonly string[];
  readonly content: string;
  readonly empty?: boolean;
};

const NEWLINE_RGGEX = /\r\n|\r|\n/;

function checkNotNull<T>(v: T | null | undefined): T {
  if (v == null) {
    throw new Error();
  }
  return v;
}

// Empty lines need to contain a single empty token, denoted with { empty: true }
function normalizeEmptyLines(line: Token[]): void {
  if (line.length === 0) {
    line.push({ types: ['plain'], content: '\n', empty: true });
    return;
  }
  if (line.length === 1) {
    const firstLine = checkNotNull(line[0]);
    if (firstLine.content === '') {
      line[0] = { ...firstLine, content: '\n', empty: true };
    }
  }
}

function appendTypes(types: string[], add: readonly string[] | string): string[] {
  const typesSize = types.length;
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types;
  }
  return types.concat(add);
}

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
export default function normalizeTokens(
  tokens: ReadonlyArray<PrismToken | string>,
): readonly (readonly Token[])[] {
  const typeArrStack: string[][] = [[]];
  const tokenArrStack = [tokens];
  const tokenArrIndexStack = [0];
  const tokenArrSizeStack = [tokens.length];

  let i = 0;
  let stackIndex = 0;
  let currentLine: Token[] = [];

  const acc = [currentLine];

  while (stackIndex > -1) {
    while ((i = tokenArrIndexStack[stackIndex]++) < checkNotNull(tokenArrSizeStack[stackIndex])) {
      let content: readonly (PrismToken | string)[] | string;
      let types = checkNotNull(typeArrStack[stackIndex]);
      const tokenArr = checkNotNull(tokenArrStack[stackIndex]);
      const token = checkNotNull(tokenArr[i]);

      // Determine content and append type to types if necessary
      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain'];
        content = token;
      } else {
        types = appendTypes(types, token.type);
        if (token.alias) {
          types = appendTypes(types, token.alias);
        }

        content = token.content;
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== 'string') {
        stackIndex++;
        typeArrStack.push(types);
        tokenArrStack.push(content);
        tokenArrIndexStack.push(0);
        tokenArrSizeStack.push(content.length);
        continue;
      }

      // Split by newlines
      const splitByNewlines = content.split(NEWLINE_RGGEX);
      const newlineCount = splitByNewlines.length;

      currentLine.push({ types, content: checkNotNull(splitByNewlines[0]) });

      // Create a new line for each string on a new line
      for (let j = 1; j < newlineCount; j += 1) {
        normalizeEmptyLines(currentLine);
        acc.push((currentLine = []));
        currentLine.push({ types, content: checkNotNull(splitByNewlines[j]) });
      }
    }

    // Decreate the stack depth
    stackIndex--;
    typeArrStack.pop();
    tokenArrStack.pop();
    tokenArrIndexStack.pop();
    tokenArrSizeStack.pop();
  }

  normalizeEmptyLines(currentLine);
  return acc;
}
