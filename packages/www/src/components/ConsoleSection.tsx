import React, { ReactNode } from 'react';

type Props = { readonly title: string; readonly children: ReactNode };

export default function ConsoleSection({ title, children }: Props): JSX.Element {
  return (
    <section>
      <h3 className="sticky z-10 top-0 w-full px-0 py-4 text-center font-medium inherit-background">
        <code>
          $&nbsp;
          {title}
        </code>
      </h3>
      {children}
    </section>
  );
}
