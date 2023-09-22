import type { FlagsSpec, ParsedArgsObject } from "./arg-parse";
import parseArguments from "./arg-parse";

export default function defineCommand<S extends FlagsSpec>(
  spec: S,
  runner: (parsed: ParsedArgsObject<S>) => unknown,
): (args: readonly string[]) => unknown {
  return (args) => runner(parseArguments(spec, args));
}
