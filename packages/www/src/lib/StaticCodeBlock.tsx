import devSamTheme from "dev-sam-theme/themes/dev-sam-theme.json";
import * as shiki from "shiki";
import samlangGrammar from "./samlang-syntax.json";

type Props = {
  readonly language: string;
  readonly className?: string;
  readonly transparent?: boolean;
  readonly manualSection?: React.ReactNode;
  readonly children: string;
};

function Token({ token }: { token: shiki.ThemedToken }): React.JSX.Element {
  switch (token.fontStyle) {
    case 2:
      return <span style={{ color: token.color, fontWeight: "bold" }}>{token.content}</span>;
    case 1:
      return <span style={{ color: token.color, fontStyle: "italic" }}>{token.content}</span>;
    default:
      return <span style={{ color: token.color }}>{token.content}</span>;
  }
}

const lang: shiki.LanguageRegistration = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ...(samlangGrammar as any),
  name: "samlang",
  scopeName: "text.samlang",
};

export default async function StaticCodeBlock({
  language,
  className,
  transparent = false,
  manualSection,
  children,
}: Props): Promise<React.JSX.Element> {
  const theme: shiki.ThemeInput = {
    ...devSamTheme,
    settings: devSamTheme.tokenColors,
    name: "dev-sam-theme",
    bg: transparent ? "transparent" : "#F7F7F7",
    type: "light",
  };
  const highlighter = await shiki.getSingletonHighlighter({
    themes: [theme],
    langs: [lang, "bash", "js", "json", "rust", "typescript", "tsx"],
  });

  return (
    <pre className={className} style={{ color: theme.fg, backgroundColor: theme.bg }}>
      {manualSection}
      {highlighter
        .codeToTokens(children, {
          lang: language as shiki.BuiltinLanguage,
          theme: "dev-sam-theme",
        })
        .tokens.map((line, i) => (
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
