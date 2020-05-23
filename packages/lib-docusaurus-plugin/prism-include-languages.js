/* eslint-disable global-require */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Prism from 'prism-react-renderer/prism';

(() => {
  if (ExecutionEnvironment.canUseDOM) {
    require('lib-prism-extended')(Prism);

    window.Prism = Prism;
    require('prismjs/components/prism-clike');
    require('prismjs/components/prism-java');
    require('prismjs/components/prism-kotlin');
    require('prismjs/components/prism-yaml');
    delete window.Prism;
  }
})();
