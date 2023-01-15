import type { AnchorHTMLAttributes } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { readonly to: string };

const serverOnlyCollectedLinks: string[] = [];

const Link = ({ to, children, ...props }: Props): JSX.Element => {
  if (__SERVER__) {
    serverOnlyCollectedLinks.push(to);
    return <a {...{ ...props, href: to }}>{children}</a>;
  }
  return <RouterLink {...{ ...props, to }}>{children}</RouterLink>;
};

export function __DO_NOT_USE_SERVER_ONLY_COLLECTED_LINKS__(): readonly string[] {
  const cloned = [...serverOnlyCollectedLinks];
  serverOnlyCollectedLinks.length = 0;
  return cloned;
}

export default Link;
