/* eslint-disable global-require */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Prism from 'prism-react-renderer/prism';

import extendPrism from 'lib-prism-extended';

(() => {
  extendPrism(Prism);
  if (ExecutionEnvironment.canUseDOM) {
    window.Prism = Prism;
    require('prismjs/components/prism-clike');
    require('prismjs/components/prism-java');
    require('prismjs/components/prism-kotlin');
    require('prismjs/components/prism-yaml');
    delete window.Prism;
  }
})();
