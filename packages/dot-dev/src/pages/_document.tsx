import React, { ReactNode } from 'react';

import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import initializeThemeSwitching from 'lib-theme-switcher';

import 'infima/dist/css/default/default.min.css';
import './index.scss';

if (!__SERVER__) {
  initializeThemeSwitching();
}

const Document = ({ children }: { readonly children: ReactNode }): JSX.Element => (
  <>
    <CommonHeader
      title="Fan Arts | Random@dev-sam"
      description="Random stuff about Developer Sam"
      shortcutIcon="https://developersam.com/favicon.ico"
      htmlLang="en"
      ogAuthor="Developer Sam"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
      />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
    </CommonHeader>
    {children}
  </>
);

export default Document;
