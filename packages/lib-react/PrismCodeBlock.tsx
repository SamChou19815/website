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
  readonly excludeWrapper?: boolean;
};

export default ({
  language,
  children,
  className: userDefinedClassname,
  style: userDefinedStyles,
  excludeWrapper,
}: Props): ReactElement => {
  return (
    <Highlight
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...defaultProps}
      theme={theme as PrismTheme}
      code={children.trim()}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const combinedStyle =
          userDefinedStyles == null ? style : { ...style, ...userDefinedStyles };
        const content = tokens.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key, react/jsx-props-no-spreading
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
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
