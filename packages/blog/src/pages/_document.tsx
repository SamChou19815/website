import React, { ReactElement, ReactNode } from 'react';

import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import DocNavBar from 'lib-react-docs/components/DocNavBar';

import 'infima/dist/css/default/default.min.css';
import './index.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <CommonHeader
        title="Developer Sam's Blog"
        description="Developer Sam's Blog"
        shortcutIcon="https://developersam.com/logo.png"
        htmlLang="en"
        ogAuthor="Developer Sam"
        ogURL="https://blog.developersam.com/"
      />
      <DocNavBar
        title="Developer Sam's Blog"
        logo="https://developersam.com/logo.png"
        logoName="Developer Sam Logo"
        otherLinks={[
          { name: 'Main Site', link: 'https://developersam.com' },
          { name: 'GitHub', link: 'https://github.com/SamChou19815/website' },
        ]}
      />
      <div className="main-wrapper">{children}</div>
      <footer className="footer footer--dark">
        <div className="container">
          <div className="footer__bottom text--center">
            <div className="footer__copyright">Copyright © 2016-2021 Developer Sam.</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Document;
