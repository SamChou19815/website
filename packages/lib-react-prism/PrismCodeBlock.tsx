// Forked from: https://github.com/FormidableLabs/prism-react-renderer

import type { ReactNode } from "react";
import { tokenize } from "./lexer";

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
        // biome-ignore lint/suspicious/noArrayIndexKey: no other good choice
        <div key={i} className="token-line">
          {line.map((token, key) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no other good choice
            <span key={key} className={`token ${token.kind}`}>
              {token.raw}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}
