import React, { ReactElement, ReactNode } from 'react';

import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import DocNavBar from 'lib-react-docs/components/DocNavBar';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-docs/components/docs-styles.scss';
import './custom.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <CommonHeader
        title="samlang"
        description="Sam's Programming Language"
        shortcutIcon="/img/favicon.png"
        htmlLang="en"
        ogURL="https://samlang.io/"
      />
      <DocNavBar
        title="samlang"
        logo="/img/logo.svg"
        logoName="samlang logo"
        firstDocumentLink="/docs/introduction"
        otherLinks={[
          { name: 'Demo', link: '/demo' },
          { name: 'GitHub', link: 'https://github.com/SamChou19815/samlang' },
        ]}
      />
      <div className="main-wrapper">{children}</div>
    </>
  );
};

export default Document;
