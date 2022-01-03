/* eslint-disable */

import { useLocation } from 'esbuild-scripts/components/router-hooks';
import { useEffect } from 'react';

function loadGA() {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
}

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  loadGA();
  window.ga('create', 'UA-140662756-1', 'auto');
}

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!__SERVER__) {
      const rawPath = location.pathname + location.search;
      if (process.env.NODE_ENV === 'production') {
        window.ga('send', { hitType: 'pageview', page: rawPath.replace(/^\s+|\s+$/g, '') });
      } else {
        console.info('react-ga', `Visited: ${rawPath}`);
      }
    }
  }, [location]);
}
