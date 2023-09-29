import type { ConditionalTypeAny } from "./any-flavors";

export type FlagSpec =
  | { readonly short?: string; readonly kind: "boolean" }
  | { readonly short?: string; readonly default?: string; readonly kind: "string" }
  | { readonly short?: string; readonly default?: number; readonly kind: "number" }
  | { readonly short?: string; readonly kind: "enum"; readonly variants: readonly string[] };

export type FlagsSpec = { readonly [long: string]: FlagSpec };

type FlagSpecToType<T extends FlagSpec> = T["kind"] extends "boolean"
  ? boolean
  : T["kind"] extends "string"
  ? string
  : T["kind"] extends "number"
  ? number
  : T["kind"] extends "enum"
  ? T extends { readonly variants: readonly string[] }
    ? T["variants"][number]
    : never
  : never;

export type ParsedArgsObject<S extends FlagsSpec> = {
  spec: {
    readonly [K in keyof S]: FlagSpecToType<S[K]>;
  };
  positionals: readonly string[];
};

export default function parseArguments<const S extends FlagsSpec>(
  spec: S,
  args: readonly string[],
): ParsedArgsObject<S> {
  const positionals: Array<string> = [];
  const parsedSpec: { [key: string]: boolean | string | number } = {};

  for (let i = 0; i < args.length; i += 1) {
    const current = args[i];
    if (current == null) throw i;
    let key: string;
    let relevantSpec: FlagSpec;
    if (current.startsWith("--")) {
      key = current.slice(2);
      const s = spec[key];
      if (s == null) {
        throw `Invalid flag: ${current}`;
      }
      relevantSpec = s;
    } else if (current.startsWith("-")) {
      const specAndLong = Object.entries(spec).find((it) => it[1].short === current.slice(1));
      if (specAndLong == null) {
        throw `Invalid flag: ${current}`;
      }
      relevantSpec = specAndLong[1];
      key = specAndLong[0];
    } else {
      positionals.push(current);
      continue;
    }
    switch (relevantSpec.kind) {
      case "boolean":
        parsedSpec[key] = true;
        break;
      case "string": {
        const next = args[i + 1];
        if (next == null) {
          throw `Missing argument for flag: ${key}`;
        }
        parsedSpec[key] = next;
        i += 1;
        break;
      }
      case "number": {
        const next = args[i + 1];
        if (next == null) {
          throw `Missing argument for flag: ${key}`;
        }
        const n = parseInt(next, 10);
        if (Number.isNaN(n)) {
          throw `Invalid number argument for flag: ${key}`;
        }
        parsedSpec[key] = n;
        i += 1;
        break;
      }
      case "enum": {
        const next = args[i + 1];
        if (next == null) {
          throw `Missing argument for flag: ${key}`;
        }
        if (!relevantSpec.variants.includes(next)) {
          throw `Invalid enum value for flag: ${key}. Supported ones are: ${relevantSpec.variants.join(
            " ",
          )}`;
        }
        parsedSpec[key] = next;
        i += 1;
        break;
      }
      default:
        throw "";
    }
  }

  for (const [long, flagSpec] of Object.entries(spec)) {
    if (flagSpec.kind === "boolean") continue;
    if (parsedSpec[long] == null) {
      if (flagSpec.kind === "enum" || flagSpec.default == null) {
        throw `Missing required flag: ${long}`;
      }
      parsedSpec[long] = flagSpec.default;
    }
  }

  return { spec: parsedSpec as ConditionalTypeAny, positionals };
}
