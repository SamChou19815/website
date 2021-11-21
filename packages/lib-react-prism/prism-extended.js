module.exports = function initialize(Prism) {
  Prism.languages.samlang = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
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
  Prism.languages.llvm = {
    comment: /;.*/,
    string: {
      pattern: /"[^"]*"/,
      greedy: true,
    },
    boolean: /\b(?:true|false)\b/,
    variable: /[%@!#](?:(?!\d)(?:[-$.\w]|\\[a-f\d]{2})+|\d+)/i,
    label: /(?!\d)(?:[-$.\w]|\\[a-f\d]{2})+:/i,
    type: {
      pattern:
        /\b(?:double|float|fp128|half|i[1-9]\d*|label|metadata|ppc_fp128|token|void|x86_fp80|x86_mmx)\b/,
      alias: 'class-name',
    },
    keyword: /\b[a-z_][a-z_0-9]*\b/,
    number:
      /[+-]?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-Fa-f]+\b|\b0xK[\dA-Fa-f]{20}\b|\b0x[ML][\dA-Fa-f]{32}\b|\b0xH[\dA-Fa-f]{4}\b/,
    punctuation: /[{}[\];(),.!*=<>]/,
  };
};
