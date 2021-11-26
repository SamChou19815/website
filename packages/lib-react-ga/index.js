/* eslint-disable */

import { useLocation } from 'esbuild-scripts/components/router-hooks';
import { useEffect } from 'react';

function loadGA() {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/
  window['GoogleAnalyticsObject'] = 'ga';
  const ga = (...args) => (window.ga.q = window.ga.q || []).push(...args);
  ga.l = 1 * new Date();
  window.ga = ga;
  const a = document.createElement('script');
  const m = document.getElementsByTagName('script')[0];
  a.async = true;
  a.src = 'https://www.google-analytics.com/analytics.js';
  m.parentNode.insertBefore(a, m);
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
        console.info('lib-react-ga', `Visited: ${rawPath}`);
      }
    }
  }, [location]);
}
