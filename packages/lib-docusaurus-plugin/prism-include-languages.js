/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

// eslint-disable-next-line import/no-unresolved
import Prism from 'prism-react-renderer/prism';

import extendPrism from 'lib-prism-extended';

(() => {
  extendPrism(Prism);
})();
