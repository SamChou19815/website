import highlight, { HLJSStatic, IMode } from 'highlight.js';

const simpleTypeMode: IMode = {
  className: 'type',
  begin: /[A-Z][A-Za-z0-9]*/,
  end: '',
};

const simpleIdentifierAsFunctionCallMode: IMode = {
  className: 'function-call',
  begin: /[a-z][A-Za-z0-9]*/,
  end: '',
};

const keywords = {
  keyword: 'class val function method import private if then else match from',
  literal: 'false true _',
  // eslint-disable-next-line @typescript-eslint/camelcase
  built_in: 'unit int bool string this',
};

const createModeWithNested = (className: string, regex: RegExp, nested: IMode): IMode => ({
  className,
  begin: regex,
  returnBegin: true,
  end: '',
  contains: [nested],
});

const createModeWithType = (className: string, regex: RegExp): IMode =>
  createModeWithNested(className, regex, simpleTypeMode);

const createModeWithFunctionCall = (className: string, regex: RegExp): IMode =>
  createModeWithNested(className, regex, simpleIdentifierAsFunctionCallMode);

export default (): void =>
  highlight.registerLanguage(
    'samlang',
    (hljs: HLJSStatic | undefined): IMode => {
      if (hljs === undefined) {
        throw new Error('highlight is not defined.');
      }
      return {
        keywords,
        contains: [
          highlight.C_LINE_COMMENT_MODE,
          highlight.C_BLOCK_COMMENT_MODE,
          highlight.NUMBER_MODE,
          highlight.QUOTE_STRING_MODE,
          {
            className: 'punctuations',
            begin: /,|\[|]|\.|=|->|:/,
            end: '',
          },
          {
            className: 'import-part',
            begin: /import\s*\{/,
            end: /\}/,
            keywords: 'import',
            contains: [simpleTypeMode],
          },
          {
            className: 'from-part',
            begin: /from/,
            end: /\s*(?=(import|class|$))/,
            keywords: 'from',
            contains: [simpleTypeMode],
          },
          {
            className: 'type-parameters',
            keywords,
            begin: '<',
            end: '>',
            excludeBegin: true,
            excludeEnd: true,
            contains: [simpleTypeMode],
          },
          createModeWithFunctionCall('simple-function-call', /[a-z][A-Za-z0-9]*\s*\(/),
          createModeWithType('variant-constructor', /[A-Z][A-Za-z0-9]*\s*\(/),
          createModeWithType('class-function', /[A-Z][A-Za-z0-9]*\s*./),
          createModeWithType('class-name-with-type-parameter', /[A-Z][A-Za-z0-9]*\s*</),
          createModeWithType('utility-class-name', /[A-Z][A-Za-z0-9]*\s*\{/),
          {
            className: 'type',
            begin: /\s+[A-Z][A-Za-z0-9]*/,
            end: '',
          },
        ],
      };
    }
  );
