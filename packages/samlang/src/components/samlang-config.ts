import * as samlang from 'samlang-demo';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { editor, languages } from 'monaco-editor/esm/vs/editor/editor.api';

export type MonacoEditor = typeof monaco;

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

export function initializeMonacoEditor(
  monacoEditor: MonacoEditor,
  sourceBox: { readonly source: string },
) {
  monacoEditor.editor.defineTheme('sam-theme', monacoEditorTheme);
  monacoEditor.languages.register({ id: 'samlang' });
  monacoEditor.languages.setLanguageConfiguration('samlang', languageConfiguration);
  monacoEditor.languages.setMonarchTokensProvider('samlang', languageDefinition);

  monacoEditor.languages.registerHoverProvider('samlang', {
    provideHover(_, position) {
      return samlang.queryType(sourceBox.source, position.lineNumber, position.column);
    },
  });

  monacoEditor.languages.registerCompletionItemProvider('samlang', {
    triggerCharacters: ['.'],
    async provideCompletionItems(editor, position) {
      const offset = editor.getOffsetAt(position);
      let source = sourceBox.source;
      if (sourceBox.source.charAt(offset) !== '.') {
        source = `${source.substring(0, offset)}.${source.substring(offset)}`;
      }
      try {
        const suggestions = await samlang.autoComplete(
          source,
          position.lineNumber,
          position.column,
        );
        return { suggestions };
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  });

  monacoEditor.languages.registerDefinitionProvider('samlang', {
    async provideDefinition(model, position) {
      const range = await samlang.queryDefinitionLocation(
        sourceBox.source,
        position.lineNumber,
        position.column,
      );
      return range != null ? { uri: model.uri, range } : null;
    },
  });
}
