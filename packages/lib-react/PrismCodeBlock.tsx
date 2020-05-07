import React, { ReactElement, CSSProperties } from 'react';

import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-kotlin';
import 'lib-prism-extended';

import theme from './prims-theme.json';

type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly style?: CSSProperties;
};

export default ({
  language,
  children,
  className: userDefinedClassname,
  style: userDefinedStyles,
}: Props): ReactElement => {
  return (
    <Highlight
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...defaultProps}
      Prism={Prism}
      theme={theme as PrismTheme}
      code={children}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const combinedStyle =
          userDefinedStyles == null ? style : { ...style, ...userDefinedStyles };
        return (
          <pre className={combinedClassname} style={combinedStyle}>
            {tokens.map((line, i) => (
              // eslint-disable-next-line react/no-array-index-key, react/jsx-props-no-spreading
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        );
      }}
    </Highlight>
  );
};
