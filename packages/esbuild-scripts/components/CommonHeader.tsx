import React, { ReactNode } from 'react';
import Head from './Head';
import HeadTitle from './HeadTitle';

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
  // Google Analytics
  readonly gaId?: string;
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
  gaId,
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
      {gaId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>}
      {gaId && (
        <script>
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
        </script>
      )}
      {children}
    </Head>
  </>
);

export default CommonHeader;
