// eslint-disable-next-line spaced-comment
/// <reference types="node" />

declare module 'react-console-emulator' {
  import { ReactElement, CSSProperties } from 'react';

  type StyleProps = {
    readonly style?: CSSProperties;
    readonly componentStyle?: CSSProperties;
    readonly inputAreaStyle?: CSSProperties;
    readonly promptLabelStyle?: CSSProperties;
    readonly inputStyle?: CSSProperties;
  };

  type ClassNameProps = {
    readonly className?: string;
    readonly contentClassName?: string;
    readonly inputAreaClassName?: string;
    readonly promptLabelClassName?: string;
    readonly inputClassName?: string;
  };

  type OptionProps = {
    readonly autoFocus?: boolean;
    readonly dangerMode?: boolean;
    readonly disableOnProcess?: boolean;
    readonly noDefaults?: boolean;
    readonly noAutomaticStdout?: boolean;
    readonly noHistory?: boolean;
    readonly noAutoScroll?: boolean;
  };

  type LabelProps = {
    readonly welcomeMessage?: boolean | string | readonly string[];
    readonly promptLabel?: string;
    readonly errorText?: string;
  };

  type CommandSpecification = {
    readonly description?: string;
    readonly usage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly fn: (...args: any[]) => any;
    readonly explicitExec?: boolean;
  };

  export type Commands = { readonly [commandName: string]: CommandSpecification };

  type CommandProps = {
    readonly commands: Commands;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly commandCallback?: (result: any) => void;
  };

  type Props = StyleProps & ClassNameProps & OptionProps & LabelProps & CommandProps;

  declare const ReactConsoleEmulator = (props: Props) => ReactElement;

  export default ReactConsoleEmulator;
}
