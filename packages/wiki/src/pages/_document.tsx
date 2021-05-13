import React, { ReactElement, ReactNode } from 'react';

import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import DocNavBar from 'lib-react-docs/components/DocNavBar';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-docs/components/docs-styles.scss';
import './index.css';
import './app.scss';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <CommonHeader
        title="Wiki"
        description="Developer Sam's Wiki"
        shortcutIcon="https://developersam.com/favicon.ico"
        htmlLang="en"
        ogAuthor="Developer Sam"
        ogURL="https://wiki.developersam.com/"
      />
      <DocNavBar
        title="Wiki"
        logo="https://developersam.com/logo.png"
        logoName="Developer Sam logo"
        githubLink="https://github.com/SamChou19815/website"
        firstDocumentLink="/docs/intro"
        otherLinks={[{ name: 'internals@dev-sam', link: '/intern' }]}
      />
      <div className="main-wrapper">{children}</div>
    </>
  );
};

export default Document;
