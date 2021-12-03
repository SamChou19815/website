import React, { ReactNode } from 'react';

export default function Article({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <article className="mb-4 p-4 bg-white filter drop-shadow-sm font-serif rounded-md border border-solid border-gray-200">
      {children}
    </article>
  );
}
