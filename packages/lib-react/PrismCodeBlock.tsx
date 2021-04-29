import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
// @ts-expect-error: no type definition
import Prism from 'prism-react-renderer/prism';
import React, { ReactElement, CSSProperties } from 'react';

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
    <Highlight
      {...defaultProps}
      Prism={Prism}
      theme={userDefinedTheme || flexibleTheme}
      code={children}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const combinedStyle =
          userDefinedStyles == null ? style : { ...style, ...userDefinedStyles };
        const content = tokens.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key, react/jsx-key
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              // eslint-disable-next-line react/jsx-key
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
