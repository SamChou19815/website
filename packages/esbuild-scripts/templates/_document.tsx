import React, { ReactNode } from 'react';

// The Head component lets you customize what goes into your head part of HTML.
// import Head from 'esbuild-scripts/components/Head';
// The CommonHeader component lets to customize most of the common head information.
import CommonHeader from 'esbuild-scripts/components/CommonHeader';

import './index.css';

/** The component that is your page template. */
export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <>
      <CommonHeader
        title="esbuild-scripts powered react app"
        description="I am a description"
        shortcutIcon="fav icon link"
        htmlLang="en"
      />
      {children}
    </>
  );
}
