import React, { ReactElement, ReactNode } from 'react';
import ReactGA from 'react-ga';
import { RecoilRoot } from 'recoil';

import Head from 'esbuild-scripts/Head';
import initializeThemeSwitching from 'lib-react/theme-switcher-initializer';

import 'infima/dist/css/default/default.min.css';
import 'lib-react/PrismCodeBlock.css';
import 'lib-web-terminal/styles.css';
import './index.css';
import './app.scss';

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  ReactGA.initialize('UA-140662756-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

if (!__SERVER__) {
  initializeThemeSwitching();
}

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <>
    <Head>
      <html lang="en" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#F7F7F7" />
      <meta name="keywords" content="Sam, Developer Sam, developer, web apps, open source" />
      <meta
        name="description"
        content="Explore the portfolio and projects created and open sourced by Developer Sam."
      />
      <meta property="og:title" content="Developer Sam" />
      <meta property="og:type" content="profile" />
      <meta property="og:url" content="https://developersam.com/" />
      <meta property="og:image" content="https://developersam.com/sam-by-megan-3-square.webp" />
      <meta
        property="og:description"
        content="Explore the portfolio and projects created and open sourced by Developer Sam."
      />
      <meta name="author" content="Developer Sam" />
      <link rel="canonical" href="https://developersam.com/" />
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
      />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
      <title>Developer Sam</title>
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
    </Head>
    <RecoilRoot>{children}</RecoilRoot>
  </>
);

export default Document;
