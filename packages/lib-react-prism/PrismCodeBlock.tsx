import type { ReactNode } from 'react';
import Highlight, { type PrismTheme } from './Highlight';
import Prism from './prism-core';
import registerPrismLanguages from './prism-languages';
import theme from './prism-theme.json';

registerPrismLanguages(Prism);

export type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly manualSection?: ReactNode;
  readonly theme?: PrismTheme;
};

export const flexibleTheme: PrismTheme = theme as PrismTheme;

export default function PrismCodeBlock({
  language,
  children,
  className: userDefinedClassname,
  theme: userDefinedTheme,
  manualSection,
}: Props): JSX.Element {
  return (
    <Highlight
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
      Prism={Prism as any}
      theme={userDefinedTheme || flexibleTheme}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const combinedClassname =
          userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
        const content = tokens.map((line, i) => (
          // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ));
        return (
          <pre className={combinedClassname} style={style}>
            {manualSection}
            {content}
          </pre>
        );
      }}
    </Highlight>
  );
}
