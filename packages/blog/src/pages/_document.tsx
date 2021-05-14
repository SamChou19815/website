import React, { FC } from 'react';

import createDocumentComponent from 'lib-react-docs/components/DocumentTemplate';
import usePageTracking from 'lib-react-ga';

import 'infima/dist/css/default/default.min.css';
import './index.css';

const Document = createDocumentComponent({
  title: "Developer Sam's Blog",
  description: "Developer Sam's Blog",
  logo: 'https://developersam.com/logo.png',
  author: 'Developer Sam',
  url: 'https://blog.developersam.com/',
  otherLinks: [
    { name: 'Main Site', link: 'https://developersam.com' },
    { name: 'GitHub', link: 'https://github.com/SamChou19815/website' },
  ],
  copyright: 'Copyright © 2016-2021 Developer Sam.',
});

const DocumentWrapper: FC = ({ children }) => {
  usePageTracking();
  return <Document>{children}</Document>;
};

export default DocumentWrapper;
