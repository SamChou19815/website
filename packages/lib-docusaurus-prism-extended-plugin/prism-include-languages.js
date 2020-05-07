/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Prism from 'prism-react-renderer/prism';

(() => {
  if (ExecutionEnvironment.canUseDOM) {
    window.Prism = Prism;

    require('lib-prism-extended');
    require('prismjs/components/prism-clike');
    require('prismjs/components/prism-java');
    require('prismjs/components/prism-kotlin');
    require('prismjs/components/prism-yaml');

    delete window.Prism;
  }
})();
