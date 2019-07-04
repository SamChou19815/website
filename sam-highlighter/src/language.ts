import highlight, { HLJSStatic, IModeBase } from 'highlight.js';

export default (): void =>
  highlight.registerLanguage(
    'samlang',
    (hljs: HLJSStatic | undefined): IModeBase => {
      if (hljs === undefined) {
        throw new Error('highlight is not defined.');
      }
      return {
        keywords: {
          keyword: 'class util val function method as public if then else match',
          literal: 'false true _',
          // eslint-disable-next-line @typescript-eslint/camelcase
          built_in: 'unit int bool string this panic'
        },
        contains: [
          hljs.QUOTE_STRING_MODE,
          // @ts-ignore
          hljs.C_LINE_COMMENT_MODE,
          // @ts-ignore
          hljs.C_BLOCK_COMMENT_MODE,
          // @ts-ignore
          hljs.NUMBER_MODE,
          {
            className: 'type',
            begin: '(?<![A-Za-z0-9])[A-Z][A-Za-z0-9]*',
            end: ''
          },
          {
            className: 'method',
            begin: /::/,
            end: /\(/,
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: 'type-params',
            begin: /<(?!(int|string|bool))/,
            end: />/,
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: 'punctuations',
            begin: /,|\[|]|::|=| |:/,
            end: ''
          }
        ]
      } as IModeBase;
    }
  );
