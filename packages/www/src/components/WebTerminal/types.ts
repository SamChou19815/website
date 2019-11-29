export type TerminalHistory = { readonly isCommand: boolean; readonly line: string };

export type CommandSpecification = {
  readonly description: string;
  readonly usage?: string;
  readonly fn: (...args: string[]) => string | void;
};

export type Commands = { readonly [commandName: string]: CommandSpecification };
