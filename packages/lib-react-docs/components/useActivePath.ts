import { useLocation } from 'esbuild-scripts/components/router-hooks';

export default function useActivePath(): string {
  let activePath = useLocation().pathname;
  if (activePath.endsWith('/')) activePath = activePath.substring(0, activePath.length - 1);
  return activePath;
}
