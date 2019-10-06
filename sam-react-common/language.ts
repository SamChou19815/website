import highlight, { HLJSStatic, IMode } from 'highlight.js';

export default (): void =>
  highlight.registerLanguage(
    'samlang',
    (hljs: HLJSStatic | undefined): IMode => {
      if (hljs === undefined) {
        throw new Error('highlight is not defined.');
      }
      return {
        keywords: {
          keyword: 'class val function method as public if then else match import from',
          literal: 'false true _',
          // eslint-disable-next-line @typescript-eslint/camelcase
          built_in: 'unit int bool string this panic'
        },
        contains: [
          hljs.QUOTE_STRING_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
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
            className: 'punctuations',
            begin: /,|\[|]|::|=| |:/,
            end: ''
          }
        ]
      };
    }
  );
