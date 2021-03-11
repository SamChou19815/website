import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, useEffect } from 'react';
import ReactGA from 'react-ga';
import { RecoilRoot } from 'recoil';

import 'infima/dist/css/default/default.min.css';
import 'lib-react/PrismCodeBlock.css';
import './index.css';
import {
  useSetDeveloperSamOnBirthday,
  useTerminalForceOnBirthday,
} from '../components/global-states';

if (process.env.NODE_ENV === 'production' && process.browser) {
  ReactGA.initialize('UA-140662756-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const description = 'Explore the portfolio and projects created and open sourced by Developer Sam.';

const themeAutoSwitcher = `(function() {
function t(theme){document.documentElement.setAttribute('data-theme', theme)}
if(window.matchMedia('(prefers-color-scheme: light)').matches)t('')
if(window.matchMedia('(prefers-color-scheme: dark)').matches)t('dark')
window.matchMedia('(prefers-color-scheme: dark)').addListener(({matches:m})=>t(m?'dark':''))
})();`;

const AppContent = ({ Component, pageProps }: AppProps): ReactElement => {
  const setOnBirthday = useSetDeveloperSamOnBirthday();
  const terminalForceOnBirthday = useTerminalForceOnBirthday();

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const onBirthday = today.getMonth() === 10 && today.getDate() === 15;
      setOnBirthday(terminalForceOnBirthday || onBirthday);
    }, 200);
    return () => clearInterval(interval);
  }, [terminalForceOnBirthday, setOnBirthday]);

  return <Component {...pageProps} />;
};

const MaterialUIApp = (props: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#F7F7F7" />
        <meta name="keywords" content="Sam, Developer Sam, developer, web apps, open source" />
        <meta name="description" content={description} />
        <meta property="og:title" content="Developer Sam" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://developersam.com/" />
        <meta property="og:image" content="https://developersam.com/sam-by-megan-3-square.webp" />
        <meta property="og:description" content={description} />
        <meta name="author" content="Developer Sam" />
        <link rel="canonical" href="https://developersam.com/" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
        <title>Developer Sam</title>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'Organization',
              url: 'https://developersam.com',
              logo: 'https://developersam.com/logo.png',
            }),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'Person',
              name: 'Developer Sam',
              url: 'https://developersam.com',
              sameAs: [
                'https://www.developersam.com',
                'https://blog.developersam.com',
                'https://www.facebook.com/SamChou19815',
                'https://twitter.com/SamChou19815',
                'https://github.com/SamChou19815',
                'https://www.linkedin.com/in/sam-zhou-30b91610b/',
              ],
            }),
          }}
        />
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeAutoSwitcher }}
        />
      </Head>
      <RecoilRoot>
        <AppContent {...props} />
      </RecoilRoot>
    </>
  );
};

export default MaterialUIApp;
