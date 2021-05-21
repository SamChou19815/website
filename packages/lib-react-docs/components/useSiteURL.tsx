import React, { ReactNode, createContext, useContext } from 'react';

const BaseURLContext = createContext('/');

export const SiteURLProvider = ({
  value,
  children,
}: {
  readonly value: string;
  readonly children: ReactNode;
}): JSX.Element => <BaseURLContext.Provider value={value}>{children}</BaseURLContext.Provider>;

/** @returns final slash stripped site url */
export const useSiteURL = (): string => {
  const url = useContext(BaseURLContext);
  return url.endsWith('/') ? url.substring(0, url.length - 1) : url;
};
