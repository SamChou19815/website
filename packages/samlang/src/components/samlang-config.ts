import { ModuleReference } from '@dev-sam/samlang-core';
import type createSamlangLanguageService from '@dev-sam/samlang-core/services';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { editor, languages } from 'monaco-editor/esm/vs/editor/editor.api';

export const monacoEditorOptions: editor.IEditorConstructionOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
};

const monacoEditorTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: false,
  colors: {
    'editor.foreground': '#38484F',
    'editor.background': '#F7F7F7',
  },
  rules: [
    {
      token: 'keyword',
      foreground: '#3E7AE2',
      fontStyle: 'bold',
    },
    {
      token: 'string',
      foreground: '#1A8F52',
    },
    {
      token: 'number',
      foreground: '#C33B30',
    },
    {
      token: 'type',
      foreground: '#9A30AD',
    },
    {
      token: 'comments',
      foreground: '#808080',
    },
    {
      token: 'functions',
      foreground: '#D52262',
    },
    {
      token: 'identifier',
      foreground: '#38484F',
    },
    {
      token: 'comment',
      foreground: '#808080',
      fontStyle: '',
    },
  ],
};

export const languageConfiguration: languages.LanguageConfiguration = {
  // the default separators except `@$`
  wordPattern: /(-?\d*\.\d\w*)|([^`~!#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '<', close: '>' },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))'),
      end: new RegExp('^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))'),
    },
  },
};

const languageDefinition: languages.IMonarchLanguage = {
  keywords: [
    'val',
    'as',
    'if',
    'then',
    'else',
    'match',
    'class',
    'public',
    'private',
    'function',
    'method',
    'import',
    'from',
  ],
  operators: [
    '=',
    '>',
    '<',
    '!',
    ':',
    '==',
    '<=',
    '>=',
    '!=',
    '&&',
    '||',
    '+',
    '-',
    '*',
    '/',
    '%',
    '::',
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-z][a-zA-Z-0-9]*/,
        {
          cases: {
            '@keywords': { token: 'keyword' },
            '@default': 'identifier',
          },
        },
      ],
      [/[A-Z][a-zA-Z-0-9]*/, 'type'],
      // whitespace
      { include: '@whitespace' },
      // delimiters and operators
      [/[{}()[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        },
      ],
      // numbers
      [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
      [/0(@octaldigits)[Ll]?/, 'number.octal'],
      [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
      [/(@digits)[fFdD]/, 'number.float'],
      [/(@digits)[lL]?/, 'number'],
      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, 'string', '@string'],
      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid'],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
    comment: [
      [/[^/*]+/, 'comment'],
      // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
      // [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
    // Identical copy of comment above, except for the addition of .doc
    javadoc: [
      [/[^/*]+/, 'comment.doc'],
      // [/\/\*/, 'comment.doc', '@push' ],    // nested comment not allowed :-(
      [/\/\*/, 'comment.doc.invalid'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[/*]/, 'comment.doc'],
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
  },
};

export const DemoModuleReference = new ModuleReference(['Demo']);

export function initializeMonacoEditor(
  monacoEditor: typeof monaco,
  service: ReturnType<typeof createSamlangLanguageService>
) {
  monacoEditor.editor.defineTheme('sam-theme', monacoEditorTheme);
  monacoEditor.languages.register({ id: 'samlang' });
  monacoEditor.languages.setLanguageConfiguration('samlang', languageConfiguration);
  monacoEditor.languages.setMonarchTokensProvider('samlang', languageDefinition);
  monacoEditor.languages.registerCompletionItemProvider('samlang', {
    triggerCharacters: ['.'],
    provideCompletionItems(_, position) {
      try {
        const results = service.autoComplete(DemoModuleReference, {
          line: position.lineNumber - 1,
          character: position.column - 1,
        });
        return {
          suggestions: results.map(({ label, insertText, insertTextFormat, kind, detail }) => ({
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            label,
            insertText,
            insertTextRules: insertTextFormat === 2 ? 4 : undefined,
            kind,
            detail,
          })),
        };
      } catch {
        return null;
      }
    },
  });
}
