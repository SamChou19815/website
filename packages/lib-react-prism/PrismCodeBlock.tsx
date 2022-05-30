// @ts-expect-error: no type definition
import Prism from 'prism-react-renderer/prism';
import React from 'react';
import Highlight, { type PrismTheme } from './Highlight';
import extendLibPrism from './prism-extended';
import theme from './prism-theme.json';
import './PrismCodeBlock.css';

extendLibPrism(Prism);

export type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly theme?: PrismTheme;
};

export const flexibleTheme: PrismTheme = theme as PrismTheme;

export default function PrismCodeBlock({
  language,
  children,
  className: userDefinedClassname,
  theme: userDefinedTheme,
}: Props): JSX.Element {
  return (
    <Highlight
      Prism={Prism}
      theme={userDefinedTheme || flexibleTheme}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const content = tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ));
        return (
          <pre className={combinedClassname} style={style}>
            {content}
          </pre>
        );
      }}
    </Highlight>
  );
}
