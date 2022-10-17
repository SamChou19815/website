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
          /(class|interface|val|function|method|import|private|if|then|else|match|from|unit|int|bool|string|this|true|false)\b/,
      },
    ],
    'class-name': [
      {
        pattern: /(\b)[A-Z][A-Za-z0-9]*/,
        lookbehind: true,
      },
    ],
    operator: /-|\+|\*|\/|%|&&|\|\|\.\.\.|=>|/,
    function: /[a-z][A-Za-z0-9]*\s*(?=(\(|<))/,
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

function registerTypeScript(Prism: typeof PrismType) {
  Prism.languages.typescript = {
    comment: [
      { pattern: BLOCK_COMMENT_REGEX, lookbehind: true, greedy: true },
      { pattern: LINE_COMMENT_REGEX, lookbehind: true, greedy: true },
    ],
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
          },
        },
        string: /[\s\S]+/,
      },
    },
    string: { pattern: STRING_TOKEN_REGEX, greedy: true },
    'class-name': [
      {
        pattern: /(\b)[A-Z][A-Za-z0-9_$]*/,
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
      },
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true,
      },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|true|false|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true,
      },
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      // keywords that have to be followed by an identifier
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      // This is for `import type *, {}`
      /\btype\b(?=\s*(?:[\{*]|$))/,
    ],
    function: /[_a-z][A-Za-z0-9_$]*\s*(?=(\(|<))/,
    number: {
      pattern: RegExp(
        // eslint-disable-next-line prefer-template
        `${
          // eslint-disable-next-line prefer-template
          /(^|[^\w$])/.source
        }(?:${
          // constant
          `${/NaN|Infinity/.source}|${
            // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source
          }|${
            // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source
          }|${
            // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source
          }|${
            // decimal bigint
            /\d+(?:_\d+)*n/.source
          }|${
            // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
              .source
          }`
        })${/(?![\w$])/.source}`,
      ),
      lookbehind: true,
    },
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
    punctuation: /[{}[\];(),.:]/,
  };
}

export default function registerPrismLanguages(Prism: typeof PrismType): void {
  registerSamlang(Prism);
  registerJson(Prism);
  registerOCaml(Prism);
  registerTypeScript(Prism);
}
