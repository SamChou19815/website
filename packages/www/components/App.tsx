import React, { ReactElement } from 'react';

import Head from 'next/head';
import { Provider as ReactReduxProvider } from 'react-redux';

import { store } from '../store';
import styles from './App.module.css';
import FirstPage from './FirstPage';
import ProjectsSection from './ProjectsSection';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminal from './WebTerminal';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://blog.developersam.com" color="inherit">
      Blog
    </MaterialButtonLink>
    <MaterialButtonLink href="https://github.com/SamChou19815" color="inherit">
      GitHub
    </MaterialButtonLink>
  </>
);

const appStyles = {
  appBar: styles.AppBar,
  title: styles.Title,
};

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <Head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="keywords" content="Sam, Developer Sam, developer, web apps, open source" />
      <meta
        name="description"
        content="Explore the portfolio and projects created and open sourced
    by Developer Sam."
      />
      <meta name="author" content="Developer Sam" />
      <link rel="canonical" href="https://developersam.com/" />
      <link rel="manifest" href="/manifest.json" />
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
    </Head>
    <MaterialThemedApp
      title="Developer Sam"
      appBarPosition="fixed"
      styles={appStyles}
      buttons={buttons}
    >
      <FirstPage />
      <ProjectsSection />
      <TechTalkSection />
      <TimelineSection />
      <WebTerminal />
    </MaterialThemedApp>
  </ReactReduxProvider>
);
