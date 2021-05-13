import type { ReactNode } from 'react';

export type TerminalHistory =
  | { readonly isCommand: false; readonly line: ReactNode }
  | { readonly isCommand: true; readonly line: string };

type CommandSpecification = {
  readonly description: ReactNode;
  readonly usage?: string;
  readonly fn: (...args: string[]) => readonly ReactNode[] | ReactNode | void;
};

export type Commands = { readonly [commandName: string]: CommandSpecification };
