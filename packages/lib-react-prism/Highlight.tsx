// Forked from: https://github.com/FormidableLabs/prism-react-renderer

import type PrismType from './prism-core';
import type { Token } from './normalize-tokens';
import normalizeTokens from './normalize-tokens';

type Language = string;

type StyleObj = { readonly [key: string]: string | number | null };

type LineInputProps = {
  readonly style?: StyleObj;
  readonly className?: string;
  readonly line: readonly Token[];
  readonly [key: string]: unknown;
};

type LineOutputProps = {
  readonly style?: StyleObj;
  readonly className: string;
  readonly [key: string]: unknown;
};

type TokenInputProps = {
  readonly style?: StyleObj;
  readonly className?: string;
  readonly token: Token;
  readonly [key: string]: unknown;
};

type TokenOutputProps = {
  readonly style?: StyleObj;
  readonly className: string;
  readonly children: string;
  readonly [key: string]: unknown;
};

type RenderProps = {
  readonly tokens: readonly (readonly Token[])[];
  readonly className: string;
  readonly style?: StyleObj;
  readonly getLineProps: (input: LineInputProps) => LineOutputProps;
  readonly getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};

type PrismThemeEntry = {
  readonly [styleKey: string]: string | number | void;
  readonly color?: string;
  readonly backgroundColor?: string;
  readonly fontStyle?: 'normal' | 'italic';
  readonly fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  readonly textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  readonly opacity?: number;
};

export type PrismTheme = {
  plain: PrismThemeEntry;
  styles: ReadonlyArray<{
    types: readonly string[];
    style: PrismThemeEntry;
    languages?: readonly string[];
  }>;
};

type ThemeDict = {
  readonly [type: string]: StyleObj;
  readonly root: StyleObj;
  readonly plain: StyleObj;
};

function themeToDict(theme: PrismTheme, language: string): ThemeDict {
  const { plain } = theme;

  const themeDict: Record<string, StyleObj> = {};

  theme.styles.forEach((themeEntry) => {
    const { types, languages, style } = themeEntry;
    if (languages && !languages.includes(language)) {
      return;
    }
    types.forEach((type) => {
      // @ts-expect-error: void type
      themeDict[type] = { ...themeDict[type], ...style };
    });
  });

  // @ts-expect-error: void type
  return { ...themeDict, root: plain, plain: { ...plain, backgroundColor: null } };
}

type Props = {
  readonly Prism: typeof PrismType;
  readonly theme: PrismTheme;
  readonly language: Language;
  readonly code: string;
  readonly children: (props: RenderProps) => JSX.Element;
};

export default function Highlight({ Prism, theme, language, code, children }: Props): JSX.Element {
  const getLineProps = ({ className, style, line, ...rest }: LineInputProps): LineOutputProps => ({
    ...rest,
    className: `token-line${className ? ` ${className}` : ''}`,
    style: { ...themeToDict(theme, language)?.plain, ...style },
  });

  const getStyleForToken = ({ types, empty }: Token): StyleObj | undefined => {
    const typesSize = types.length;
    const themeDict = themeToDict(theme, language);

    if (typesSize === 1 && types[0] === 'plain') {
      return empty ? { display: 'inline-block' } : undefined;
    } else if (typesSize === 1 && !empty) {
      const type = types[0];
      if (type == null) {
        throw new Error();
      }
      return themeDict[type];
    }

    const baseStyle = empty ? { display: 'inline-block' } : {};
    return Object.assign(baseStyle, ...types.map((type) => themeDict[type]));
  };

  const getTokenProps = ({
    className,
    style,
    token,
    ...rest
  }: TokenInputProps): TokenOutputProps => ({
    ...rest,
    className: `token ${token.types.join(' ')}${className ? ` ${className}` : ''}`,
    children: token.content,
    style: { ...getStyleForToken(token), ...style },
  });

  const themeDict = themeToDict(theme, language);
  const tokens = normalizeTokens(Prism.tokenize(code, language));

  return children({
    tokens,
    className: `prism-code language-${language}`,
    style: themeDict.root,
    getLineProps,
    getTokenProps,
  });
}
