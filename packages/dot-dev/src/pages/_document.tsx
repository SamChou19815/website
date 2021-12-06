import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import React, { ReactNode } from 'react';
import './index.css';

export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <>
      <CommonHeader
        title="Fan Arts | Random@dev-sam"
        description="Random stuff about Developer Sam"
        shortcutIcon="https://developersam.com/favicon.ico"
        htmlLang="en"
        ogAuthor="Developer Sam"
      />
      {children}
    </>
  );
}
