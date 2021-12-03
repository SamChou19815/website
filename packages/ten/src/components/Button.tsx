import React from 'react';

type Props = { readonly onClick?: () => void; readonly children: string };

const buttonCSS = [
  'my-0',
  'mx-4',
  'rounded-lg',
  'bg-transparent',
  'text-sm',
  'border',
  'border-solid',
  'border-blue-500',
  'text-blue-500',
  'font-bold',
  'px-6',
  'py-2',
  'hover:bg-blue-500',
  'hover:text-white',
].join(' ');

export default function Button({ onClick, children }: Props): JSX.Element {
  return (
    <button className={buttonCSS} onClick={onClick}>
      {children}
    </button>
  );
}
