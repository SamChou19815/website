import createDocumentComponent from 'lib-react-docs/components/DocumentTemplate';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-docs/components/docs-styles.scss';
import './custom.css';

export default createDocumentComponent({
  title: 'samlang',
  description: "Sam's Programming Language",
  logo: '/img/favicon.png',
  url: 'https://samlang.io/',
  firstDocumentLink: '/docs/introduction',
  otherLinks: [
    { name: 'Demo', link: '/demo' },
    { name: 'GitHub', link: 'https://github.com/SamChou19815/samlang' },
  ],
  copyright: 'Copyright © 2019-2021 Developer Sam.',
});
