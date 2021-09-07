import { useLocation } from 'esbuild-scripts/components/router-hooks';
import { useEffect } from 'react';
import ReactGA from 'react-ga';

if (process.env.NODE_ENV === 'production' && !__SERVER__) {
  ReactGA.initialize('UA-140662756-1');
}

export default function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && !__SERVER__) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [location]);
}
