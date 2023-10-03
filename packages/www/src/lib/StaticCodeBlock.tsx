import * as fs from "fs";
import * as path from "path";
import devSamTheme from "dev-sam-theme/themes/dev-sam-theme.json";
import type { ReactNode } from "react";
import * as shiki from "shiki";

type Props = {
  readonly language: string;
  readonly className?: string;
  readonly transparent?: boolean;
  readonly manualSection?: ReactNode;
  readonly children: string;
};

// Hack because next.js has broken support to opt-out of bundling.
// Since this is server component, we only pay the cost during development.
function samlangSyntaxPath() {
  let p = __dirname;
  while (true) {
    if (fs.existsSync(path.join(p, "src", "mdx-components.tsx"))) {
      return path.join(p, "src", "lib", "samlang-syntax.json");
    }
    p = path.join(p, "..");
  }
}

function Token({ token }: { token: shiki.IThemedToken }): JSX.Element {
  switch (token.fontStyle) {
    case shiki.FontStyle.Bold:
      return <span style={{ color: token.color, fontWeight: "bold" }}>{token.content}</span>;
    case shiki.FontStyle.Italic:
      return <span style={{ color: token.color, fontStyle: "italic" }}>{token.content}</span>;
    default:
      return <span style={{ color: token.color }}>{token.content}</span>;
  }
}

export default async function StaticCodeBlock({
  language,
  className,
  transparent = false,
  manualSection,
  children,
}: Props): Promise<JSX.Element> {
  const foreground = transparent ? "transparent" : "#38484F";
  const background = transparent ? "transparent" : "#F7F7F7";
  const highlighter = await shiki.getHighlighter({
    theme: {
      ...devSamTheme,
      settings: [],
      fg: foreground,
      bg: background,
      type: "light",
    },
    langs:
      language === "samlang"
        ? [
            {
              id: "samlang",
              scopeName: "text.samlang",
              path: samlangSyntaxPath(),
            },
          ]
        : undefined,
  });

  return (
    <pre className={className} style={{ color: foreground, backgroundColor: background }}>
      {manualSection}
      {highlighter.codeToThemedTokens(children, language).map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: only valid key
        <span key={i}>
          {line.map((token, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: only valid key
            <Token key={j} token={token} />
          ))}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
