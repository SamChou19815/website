import React, { ReactNode } from 'react';

export default function Article({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <article className="mb-4 rounded-md border border-solid border-gray-200 bg-white p-4 font-serif drop-shadow-sm filter">
      {children}
    </article>
  );
}
