import React, { ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import HeadTitle from 'esbuild-scripts/components/HeadTitle';

type Props = {
  // Required
  readonly title: string;
  readonly description: string;
  readonly shortcutIcon: string;
  // SEO Things
  readonly htmlLang?: string;
  readonly themeColor?: string;
  readonly ogAuthor?: string;
  readonly ogKeywords?: string;
  readonly ogType?: string;
  readonly ogURL?: string;
  readonly ogImage?: string;
  // Additional
  readonly children?: ReactNode;
};

const CommonHeader = ({
  title,
  description,
  htmlLang,
  shortcutIcon,
  themeColor,
  ogAuthor,
  ogKeywords,
  ogType,
  ogURL,
  ogImage,
  children,
}: Props): JSX.Element => (
  <>
    <HeadTitle title={title} />
    <Head>
      {htmlLang && <html lang={htmlLang} />}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta charSet="utf-8" />
      {shortcutIcon && <link rel="shortcut icon" href={shortcutIcon} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      {ogAuthor && <meta name="author" content={ogAuthor} />}
      {ogKeywords && <meta name="keywords" content={ogKeywords} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {ogURL && <meta property="og:url" content={ogURL} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {children}
    </Head>
  </>
);

export default CommonHeader;
