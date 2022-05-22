import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import React, { ReactNode } from 'react';
import './index.css';

export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <>
      <CommonHeader
        title="Developer Sam"
        description="Explore the portfolio and projects created and open sourced by Developer Sam."
        shortcutIcon="/favicon.ico"
        htmlLang="en"
        themeColor="#F7F7F7"
        ogAuthor="Developer Sam"
        ogKeywords="Sam, Developer Sam, developer, web apps, open source"
        ogType="profile"
        ogURL="https://developersam.com/"
        ogImage="https://developersam.com/sam-by-megan-3-square.webp"
        gaId="G-K50MLQ68K6"
      >
        <link rel="canonical" href="https://developersam.com/" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap"
        />
        <script type="application/ld+json">
          {`{"@context":"http://schema.org","@type":"Organization","url":"https://developersam.com","logo":"https://developersam.com/logo.png"}`}
        </script>
        <script type="application/ld+json">
          {`{"@context":"http://schema.org","@type":"Person","name":"Developer Sam","url":"https://developersam.com","sameAs":[
  "https://www.developersam.com",
  "https://blog.developersam.com",
  "https://www.facebook.com/SamChou19815",
  "https://twitter.com/SamChou19815",
  "https://github.com/SamChou19815",
  "https://www.linkedin.com/in/sam-zhou-30b91610b/"]}`}
        </script>
      </CommonHeader>
      {children}
    </>
  );
}
