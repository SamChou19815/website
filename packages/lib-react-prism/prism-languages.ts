// Forked from https://github.com/PrismJS/prism

import type PrismType from './prism-core';

/* eslint-disable no-useless-escape */

const STRING_TOKEN_REGEX = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
const BLOCK_COMMENT_REGEX = /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/;
const LINE_COMMENT_REGEX = /(^|[^\\:])\/\/.*/;

function registerSamlang(Prism: typeof PrismType): void {
  Prism.languages.samlang = {
    comment: [
      { pattern: BLOCK_COMMENT_REGEX, lookbehind: true, greedy: true },
      { pattern: LINE_COMMENT_REGEX, lookbehind: true, greedy: true },
    ],
    string: { pattern: STRING_TOKEN_REGEX, greedy: true },
    keyword: [
      {
        pattern:
          /(class|val|function|method|import|private|if|then|else|match|from|unit|int|bool|string|this|true|false)\b/,
      },
    ],
    'class-name': [
      {
        pattern: /(\b)[A-Z][A-Za-z0-9]*/,
        lookbehind: true,
      },
    ],
    operator: /-|\+|\*|\/|%|&&|\|\|/,
    function: /[a-z][A-Za-z0-9]*\s*(?=\()/,
  };
}

function registerJson(Prism: typeof PrismType) {
  Prism.languages.json = {
    property: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      lookbehind: true,
      greedy: true,
    },
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      lookbehind: true,
      greedy: true,
    },
    comment: {
      pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true,
    },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: { pattern: /\bnull\b/, alias: 'keyword' },
  };
}

function registerOCaml(Prism: typeof PrismType) {
  Prism.languages.ocaml = {
    comment: { pattern: /\(\*[\s\S]*?\*\)/, greedy: true },
    char: { pattern: /'(?:[^\\\r\n']|\\(?:.|[ox]?[0-9a-f]{1,3}))'/i, greedy: true },
    string: [
      { pattern: /"(?:\\(?:[\s\S]|\r\n)|[^\\\r\n"])*"/, greedy: true },
      { pattern: /\{([a-z_]*)\|[\s\S]*?\|\1\}/, greedy: true },
    ],
    number: [
      // binary and octal
      /\b(?:0b[01][01_]*|0o[0-7][0-7_]*)\b/i,
      // hexadecimal
      /\b0x[a-f0-9][a-f0-9_]*(?:\.[a-f0-9_]*)?(?:p[+-]?\d[\d_]*)?(?!\w)/i,
      // decimal
      /\b\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d[\d_]*)?(?!\w)/i,
    ],
    directive: { pattern: /\B#\w+/, alias: 'property' },
    label: { pattern: /\B~\w+/, alias: 'property' },
    'type-variable': { pattern: /\B'\w+/, alias: 'function' },
    variant: { pattern: /`\w+/, alias: 'symbol' },
    // For the list of keywords and operators,
    // see: http://caml.inria.fr/pub/docs/manual-ocaml/lex.html#sec84
    keyword:
      /\b(?:as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|match|method|module|mutable|new|nonrec|object|of|open|private|rec|sig|struct|then|to|try|type|val|value|virtual|when|where|while|with)\b/,
    boolean: /\b(?:false|true)\b/,

    'operator-like-punctuation': {
      pattern: /\[[<>|]|[>|]\]|\{<|>\}/,
      alias: 'punctuation',
    },
    // Custom operators are allowed
    operator:
      /\.[.~]|:[=>]|[=<>@^|&+\-*\/$%!?~][!$%&*+\-.\/:<=>?@^|~]*|\b(?:and|asr|land|lor|lsl|lsr|lxor|mod|or)\b/,
    punctuation: /;;|::|[(){}\[\].,:;#]|\b_\b/,
  };
}

function registerJavaScript(Prism: typeof PrismType) {
  Prism.languages.javascript = {
    comment: [
      { pattern: BLOCK_COMMENT_REGEX, lookbehind: true, greedy: true },
      { pattern: LINE_COMMENT_REGEX, lookbehind: true, greedy: true },
    ],
    string: { pattern: STRING_TOKEN_REGEX, greedy: true },
    'class-name': [
      {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,
        lookbehind: true,
        inside: {
          punctuation: /[.\\]/,
        },
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: true,
      },
    ],
    'function-variable': {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function',
    },
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true,
      },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true,
      },
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function:
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    boolean: /\b(?:false|true)\b/,
    number: {
      pattern: RegExp(
        // eslint-disable-next-line prefer-template
        /(^|[^\w$])/.source +
          '(?:' +
          // constant
          (/NaN|Infinity/.source +
            '|' +
            // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source +
            '|' +
            // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
            '|' +
            // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
            '|' +
            // decimal bigint
            /\d+(?:_\d+)*n/.source +
            '|' +
            // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
              .source) +
          ')' +
          /(?![\w$])/.source
      ),
      lookbehind: true,
    },
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
    punctuation: /[{}[\];(),.:]/,
  };

  Prism.LanguageUtil.insertBefore('javascript', 'string', {
    // @ts-expect-error: Too dynamic
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string',
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation',
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  });

  Prism.LanguageUtil.insertBefore('javascript', 'function-variable', {
    'method-variable': {
      // @ts-expect-error: Too dynamic
      // eslint-disable-next-line prefer-template
      pattern: RegExp('(\\.\\s*)' + Prism.languages.javascript['function-variable'].pattern.source),
      lookbehind: true,
      alias: ['function-variable', 'method', 'function', 'property-access'],
    },
  });

  Prism.LanguageUtil.insertBefore('javascript', 'function', {
    method: {
      // @ts-expect-error: Too dynamic
      // eslint-disable-next-line prefer-template
      pattern: RegExp('(\\.\\s*)' + Prism.languages.javascript['function'].source),
      lookbehind: true,
      alias: ['function', 'property-access'],
    },
  });

  /** Replaces the `<ID>` placeholder in the given pattern with a pattern for general JS identifiers. */
  function withId(source: string, flags?: string): RegExp {
    return RegExp(
      source.replace(/<ID>/g, function () {
        return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source;
      }),
      flags
    );
  }
  Prism.LanguageUtil.insertBefore('javascript', 'keyword', {
    imports: {
      // https://tc39.es/ecma262/#sec-imports
      pattern: withId(
        /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/
          .source
      ),
      lookbehind: true,
      inside: Prism.languages.javascript,
    },
    exports: {
      // https://tc39.es/ecma262/#sec-exports
      pattern: withId(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source),
      lookbehind: true,
      inside: Prism.languages.javascript,
    },
  });

  // @ts-expect-error: Too dynamic
  Prism.languages.javascript['keyword'].unshift(
    {
      pattern: /\b(?:as|default|export|from|import)\b/,
      alias: 'module',
    },
    {
      pattern:
        /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
      alias: 'control-flow',
    },
    {
      pattern: /\bnull\b/,
      alias: ['null', 'nil'],
    },
    {
      pattern: /\bundefined\b/,
      alias: 'nil',
    }
  );

  Prism.LanguageUtil.insertBefore('javascript', 'operator', {
    spread: {
      pattern: /\.{3}/,
      alias: 'operator',
    },
    arrow: {
      pattern: /=>/,
      alias: 'operator',
    },
  });

  Prism.LanguageUtil.insertBefore('javascript', 'punctuation', {
    'property-access': {
      pattern: withId(/(\.\s*)#?<ID>/.source),
      lookbehind: true,
    },
    'maybe-class-name': {
      pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
      lookbehind: true,
    },
  });

  // add 'maybe-class-name' to tokens which might be a class name
  const maybeClassNameTokens = [
    'function',
    'function-variable',
    'method',
    'method-variable',
    'property-access',
  ];
  maybeClassNameTokens.forEach((token) => {
    // @ts-expect-error: Too dynamic
    let value = Prism.languages.javascript[token];

    // convert regex to object
    if (value instanceof RegExp) {
      // @ts-expect-error: Too dynamic
      value = Prism.languages.javascript[token] = {
        pattern: value,
      };
    }

    // keep in mind that we don't support arrays

    // @ts-expect-error: Too dynamic
    const inside = value.inside || {};
    // @ts-expect-error: Too dynamic
    value.inside = inside;

    inside['maybe-class-name'] = /^[A-Z][\s\S]*/;
  });
}

function registerTypeScript(Prism: typeof PrismType) {
  Prism.languages.typescript = Prism.LanguageUtil.extend('javascript', {
    // @ts-expect-error: Too dynamic
    'class-name': {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: true,
      greedy: true,
      inside: null, // see below
    },
    builtin:
      /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
  });

  // The keywords TypeScript adds to JavaScript
  // @ts-expect-error: Too dynamic
  Prism.languages.typescript.keyword.push(
    /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
    // keywords that have to be followed by an identifier
    /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
    // This is for `import type *, {}`
    /\btype\b(?=\s*(?:[\{*]|$))/
  );

  // a version of typescript specifically for highlighting types
  const typeInside = Prism.LanguageUtil.extend('typescript', {});
  delete typeInside['class-name'];

  // @ts-expect-error: Too dynamic
  Prism.languages.typescript['class-name'].inside = typeInside;

  Prism.LanguageUtil.insertBefore('typescript', 'function', {
    'generic-function': {
      // e.g. foo<T extends "bar" | "baz">( ...
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: true,
      inside: {
        function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        generic: {
          pattern: /<[\s\S]+/, // everything after the first <
          alias: 'class-name',
          inside: typeInside,
        },
      },
    },
  });
}

export default function registerPrismLanguages(Prism: typeof PrismType): void {
  registerSamlang(Prism);
  registerJson(Prism);
  registerOCaml(Prism);
  registerJavaScript(Prism);
  registerTypeScript(Prism);
}
