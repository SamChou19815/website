import createDocumentComponent from 'lib-react-docs/components/DocumentTemplate';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-docs/components/docs-styles.scss';
import './index.css';

export default createDocumentComponent({
  title: 'Wiki',
  description: "Developer Sam's Wiki",
  logo: 'https://developersam.com/logo.png',
  author: 'Developer Sam',
  url: 'https://wiki.developersam.com',
  firstDocumentLink: '/docs/intro',
  otherLinks: [{ name: 'GitHub', link: 'https://github.com/SamChou19815/website' }],
});
