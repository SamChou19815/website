const coloredTerminalSection = (colorID: number) => (content: string): string =>
  process.stderr.isTTY ? `\u001b[${colorID}m${content}\u001b[0m` : content;

export const redTerminalSection: (content: string) => string = coloredTerminalSection(31);
export const greenTerminalSection: (content: string) => string = coloredTerminalSection(32);
export const yellowTerminalSection: (content: string) => string = coloredTerminalSection(33);
export const blueTerminalSection: (content: string) => string = coloredTerminalSection(34);
export const magentaTerminalSection: (content: string) => string = coloredTerminalSection(35);
export const cyanTerminalSection: (content: string) => string = coloredTerminalSection(36);
