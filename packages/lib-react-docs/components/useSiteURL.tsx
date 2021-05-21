import React, { ReactNode, createContext, useContext } from 'react';

const BaseURLContext = createContext('/');

export const SiteURLProvider = ({
  value,
  children,
}: {
  readonly value: string;
  readonly children: ReactNode;
}): JSX.Element => <BaseURLContext.Provider value={value}>{children}</BaseURLContext.Provider>;

export const useSiteURL = (): string => useContext(BaseURLContext);
