// Forked from: https://github.com/FormidableLabs/prism-react-renderer

import { tokenize } from "./lexer";
import type { ReactNode } from "react";

export type Props = {
  readonly language: string;
  readonly children: string;
  readonly className?: string;
  readonly manualSection?: ReactNode;
};

export default function PrismCodeBlock({
  language,
  children,
  className: userDefinedClassname,
  manualSection,
}: Props): JSX.Element {
  const className = `prism-code language-${language}`;
  const combinedClassname =
    userDefinedClassname == null ? className : `${className} ${userDefinedClassname}`;
  return (
    <pre className={combinedClassname}>
      {manualSection}
      {tokenize(language, children).map((line, i) => (
        // rome-ignore lint/suspicious/noArrayIndexKey: no better choice
        <div key={i} className="token-line">
          {line.map((token, key) => (
            // rome-ignore lint/suspicious/noArrayIndexKey: no better choice
            <span key={key} className={`token ${token.kind}`}>
              {token.raw}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}
