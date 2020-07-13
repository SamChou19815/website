import React, { ReactElement, CSSProperties } from 'react';

import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Prism from 'prism-react-renderer/prism';

import theme from './prism-theme.json';

import extendLibPrism from 'lib-prism-extended';

extendLibPrism(Prism);

type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly theme?: PrismTheme;
  readonly excludeWrapper?: boolean;
};

export const flexibleTheme: PrismTheme = theme as PrismTheme;

const PrismCodeBlock = ({
  language,
  children,
  className: userDefinedClassname,
  style: userDefinedStyles,
  theme: userDefinedTheme,
  excludeWrapper,
}: Props): ReactElement => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error: weird types
    <Highlight
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...defaultProps}
      theme={userDefinedTheme || flexibleTheme}
      code={children.trim()}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }: any) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const combinedStyle =
          userDefinedStyles == null ? style : { ...style, ...userDefinedStyles };
        const content = tokens.map((line: string[], i: number) => (
          // eslint-disable-next-line react/no-array-index-key, react/jsx-props-no-spreading, react/jsx-key
          <div {...getLineProps({ line, key: i })}>
            {line.map((token: string, key: number) => (
              // eslint-disable-next-line react/jsx-props-no-spreading, react/jsx-key
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ));
        if (excludeWrapper) {
          return content;
        }
        return (
          <pre className={combinedClassname} style={combinedStyle}>
            {content}
          </pre>
        );
      }}
    </Highlight>
  );
};

export default PrismCodeBlock;
