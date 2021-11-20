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
  a.async = true;
  a.src = 'https://www.google-analytics.com/analytics.js';
  document.getElementsByTagName('script')[0].parentNode.insertBefore(a, m);
}

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  loadGA();
  window.ga('create', 'UA-140662756-1', 'auto');
}

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && !__SERVER__) {
      const rawPath = location.pathname + location.search;
      window.ga('send', { hitType: 'pageview', page: rawPath.replace(/^\s+|\s+$/g, '') });
    }
  }, [location]);
}
