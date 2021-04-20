import React, { ReactNode } from 'react';

// The Head component lets you customize what goes into your head part of HTML.
import Head from 'esbuild-scripts/components/Head';

import './index.css';

/** The component that is your page template. */
export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <>
      <Head>
        {/* You can also use the html tag to add attributes to your HTML parts. */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>esbuild-scripts powered react app</title>
      </Head>
      {children}
    </>
  );
}
