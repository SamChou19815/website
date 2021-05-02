import React from 'react';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Wiki</title>
      </Head>
      <header className="hero hero--primary index-hero-banner">
        <div className="container">
          <h1 className="hero__title">Wiki</h1>
          <p className="hero__subtitle">Documentation for dev-sam</p>
          <div className="index-page-buttons">
            <Link className="button button--secondary button--lg" to="docs/intro">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main />
    </>
  );
}
