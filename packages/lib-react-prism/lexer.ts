type LexerInitialPassConfig = {
  readonly keywords: readonly string[];
  readonly sortedPunctuations: readonly string[];
  readonly stringQuotes: readonly string[];
};

type TokenKind =
  | "plain"
  | "comment"
  | "keyword"
  | "punctuation"
  | "constant"
  | "number"
  | "string"
  | "identifier"
  | "function"
  | "class-name"
  | "property";

export type Token = {
  readonly kind: TokenKind;
  readonly raw: string;
};

type Lexer = (source: string) => Token[];

const getLexer =
  ({ keywords, sortedPunctuations, stringQuotes }: LexerInitialPassConfig): Lexer =>
  (source) => {
    const chars: readonly string[] = Array.from(source);
    const tokens: Token[] = [];
    let index = 0;

    function consumeUntilWhitespace(): Token {
      const start = index;
      while (index < chars.length) {
        if (chars[index]?.trim().length === 0) {
          break;
        } else {
          index += 1;
        }
      }
      return { kind: "plain", raw: chars.slice(start, index).join("") };
    }

    function consumeLineComment(): Token | null {
      if (chars.slice(index, index + 2).join("") !== "//") {
        return null;
      }
      const start = index;
      while (index < chars.length) {
        if (chars[index] === "\n") {
          index += 1;
          break;
        } else {
          index += 1;
        }
      }
      return { kind: "comment", raw: chars.slice(start, index).join("") };
    }

    function consumeBlockComment(): Token | null {
      if (chars.slice(index, index + 2).join("") !== "/*") {
        return null;
      }
      const start = index;
      index += 2;
      while (index + 1 < chars.length) {
        if (chars[index] === "*" && chars[index + 1] === "/") {
          index += 2;
          break;
        } else {
          index += 1;
        }
      }
      return { kind: "comment", raw: chars.slice(start, index).join("") };
    }

    function consumeNumber(): Token | null {
      if (chars[index] === "0") {
        index += 1;
        return { kind: "number", raw: "0" };
      }
      if (!"123456789".includes(chars[index] || "a")) {
        return null;
      }
      const start = index;
      while ("0123456789".includes(chars[index] || "a")) {
        index += 1;
      }
      if (chars[index] === ".") {
        index += 1;
        while ("0123456789".includes(chars[index] || "a")) {
          index += 1;
        }
      }
      return { kind: "number", raw: chars.slice(start, index).join("") };
    }

    function consumeString(): Token | null {
      const quote = chars[index] || "";
      if (!stringQuotes.includes(quote)) {
        return null;
      }
      const start = index;
      index += 1;
      while (chars[index] != null && chars[index] !== quote) {
        index += 1;
      }
      index += 1;
      return { kind: "string", raw: chars.slice(start, index).join("") };
    }

    function consumeIdentifier(): Token | null {
      if (!chars[index]?.match(/^[A-Za-z_]$/)) {
        return null;
      }
      const start = index;
      while (chars[index]?.match(/^[A-Za-z0-9_]$/)) {
        index += 1;
      }
      const raw = chars.slice(start, index).join("");
      const kind: TokenKind = keywords.includes(raw) ? "keyword" : "identifier";
      return { kind, raw };
    }

    function consumePunctuation(): Token | null {
      for (const p of sortedPunctuations) {
        if (chars.slice(index, index + p.length).join("") === p) {
          index += p.length;
          return { kind: "punctuation", raw: p };
        }
      }
      return null;
    }

    function next() {
      const start = index;
      while (index < chars.length) {
        if (chars[index]?.trim().length === 0) {
          index += 1;
        } else {
          if (index > start) {
            tokens.push({
              kind: "plain",
              raw: chars.slice(start, index).join(""),
            });
          }
          tokens.push(
            consumeLineComment() ??
              consumeBlockComment() ??
              consumeNumber() ??
              consumeString() ??
              consumeIdentifier() ??
              consumePunctuation() ??
              consumeUntilWhitespace(),
          );
          return true;
        }
      }
      return false;
    }

    while (next());
    return tokens;
  };

const comparatorByLength = (s1: string, s2: string) => s2.length - s1.length;

function commonPostProcess(token: Token, nextToken: () => Token | undefined): Token {
  if (token.kind === "string") {
    const next = nextToken();
    if (next?.kind === "punctuation" && next?.raw === ":") {
      return { kind: "property", raw: token.raw };
    }
  }
  if (token.kind === "identifier") {
    if (token.raw.match(/^[A-Z_]+$/)) {
      return { kind: "constant", raw: token.raw };
    }
    if (token.raw.charAt(0).match(/^[A-Z]$/)) {
      return { kind: "class-name", raw: token.raw };
    }
    const next = nextToken();
    if (next?.kind === "punctuation" && (next?.raw === "(" || next?.raw === "<")) {
      return { kind: "function", raw: token.raw };
    }
  }
  return token;
}

const JsonLexer: Lexer = getLexer({
  keywords: ["true", "false", "null"],
  sortedPunctuations: [":", "{", "}"],
  stringQuotes: [""],
});

const SamlangLexer: Lexer = getLexer({
  keywords: [
    "class",
    "interface",
    "val",
    "let",
    "const",
    "function",
    "method",
    "import",
    "private",
    "if",
    "then",
    "else",
    "match",
    "from",
    "unit",
    "int",
    "bool",
    "string",
    "this",
    "true",
    "false",
  ],
  sortedPunctuations: [
    "_",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    "?",
    ";",
    ":",
    "::",
    ",",
    ".",
    "|",
    "->",
    "=",
    "!",
    "*",
    "/",
    "%",
    "+",
    "-",
    "<",
    "<=",
    ">",
    ">=",
    "==",
    "!=",
    "&&",
    "||",
    "...",
  ].sort(comparatorByLength),
  stringQuotes: ['"'],
});

const TypeScriptLexer = getLexer({
  keywords: [
    "null",
    "undefined",
    "NaN",
    "true",
    "false",
    "catch",
    "as",
    "assert",
    "asserts",
    "async",
    "function",
    "await",
    "break",
    "case",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "finally",
    "for",
    "from",
    "if",
    "implements",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "of",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "abstract",
    "declare",
    "is",
    "keyof",
    "readonly",
    "require",
    "infer",
    "module",
    "namespace",
    "type",
  ],
  sortedPunctuations: [
    "_",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    "?",
    ";",
    ":",
    ",",
    ".",
    "|",
    "=>",
    "=",
    "!",
    "*",
    "**",
    "*=",
    "/",
    "/=",
    "%",
    "%=",
    "+",
    "++",
    "+=",
    "-",
    "-=",
    "--",
    "<",
    "<=",
    ">",
    ">=",
    "==",
    "!=",
    "&&",
    "&&=",
    "||",
    "||=",
    "??",
    "??=",
    "...",
  ].sort(comparatorByLength),
  stringQuotes: ['"', "'", "`"],
});

const fallbackLexer: Lexer = (raw) => [{ kind: "plain", raw }];

export function tokenize(language: string, source: string): ReadonlyArray<ReadonlyArray<Token>> {
  function lexOneLine(source: string): Token[] {
    switch (language.toLocaleLowerCase()) {
      case "samlang":
        return SamlangLexer(source);
      case "typescript":
        return TypeScriptLexer(source);
      case "json":
        return JsonLexer(source);
      default:
        return fallbackLexer(source);
    }
  }

  const twoDTokens = source.split("\n").map((line) => lexOneLine(line.trimEnd()));

  const nextTokenFunction = (i: number, j: number) => (): Token | undefined => {
    const currentLineResult = twoDTokens[i]?.slice(j + 1).find((t) => t.kind !== "plain");
    if (currentLineResult != null) {
      return currentLineResult;
    }
    for (const tokens of twoDTokens.slice(i + 1)) {
      const result = tokens.find((t) => t.kind !== "plain");
      if (result != null) {
        return result;
      }
    }
    return undefined;
  };

  twoDTokens.forEach((line, i) =>
    line.forEach((t, j) => {
      line[j] = commonPostProcess(t, nextTokenFunction(i, j));
    }),
  );

  return twoDTokens;
}
