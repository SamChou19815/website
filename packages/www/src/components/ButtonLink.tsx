import type { ReactNode } from 'react';

const ButtonLinkBaseCSS = [
  'button bg-transparent border-0 cursor-pointer px-6 py-1.5 font-bold text-sm text-center',
  'hover:bg-blue-500 hover:bg-opacity-10',
].join(' ');

type Props = { readonly href: string; readonly className?: string; readonly children: ReactNode };

export default function ButtonLink({ href, children, className }: Props): JSX.Element {
  return (
    <a
      className={className == null ? ButtonLinkBaseCSS : `${ButtonLinkBaseCSS} ${className}`}
      href={href}
    >
      {typeof children === 'string' ? children.toLocaleUpperCase() : children}
    </a>
  );
}
