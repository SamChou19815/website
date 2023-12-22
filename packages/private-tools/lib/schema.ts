import type { ConditionalTypeAny } from "./any-flavors";

export type FieldSpec =
  | { readonly kind: "unknown" }
  | { readonly kind: "boolean" }
  | { readonly kind: "number" }
  | { readonly kind: "string" }
  | { readonly kind: "enum"; readonly exact: string }
  | { readonly kind: "array"; readonly nested: FieldSpec }
  | { readonly kind: "object"; readonly nested: { readonly [field: string]: FieldSpec } }
  | { readonly kind: "union"; readonly variants: readonly FieldSpec[] };

export type FieldSpecToType<T extends FieldSpec> = T extends { readonly kind: "unknown" }
  ? unknown
  : T extends { readonly kind: "boolean" }
    ? boolean
    : T extends { readonly kind: "number" }
      ? number
      : T extends { readonly kind: "string" }
        ? string
        : T extends { readonly kind: "enum"; exact: string }
          ? T["exact"]
          : T extends { readonly kind: "array"; readonly nested: FieldSpec }
            ? ReadonlyArray<FieldSpecToType<T["nested"]>>
            : T extends {
                  readonly kind: "object";
                  readonly nested: { readonly [field: string]: FieldSpec };
                }
              ? { readonly [K in keyof T["nested"]]: FieldSpecToType<T["nested"][K]> }
              : T extends { readonly kind: "union"; readonly variants: readonly FieldSpec[] }
                ? FieldSpecToType<T["variants"][number]>
                : never;

export function objectSchema<const O extends { readonly [field: string]: FieldSpec }>(nested: O): {
  readonly kind: "object";
  nested: O;
} {
  return { kind: "object", nested };
}

export function defineSchema<const Spec extends FieldSpec>(spec: Spec): Spec {
  return spec;
}

function validateAccordingToSchemaUntyped<const Spec extends FieldSpec>(
  spec: Spec,
  unvalidated: unknown,
): void {
  switch (spec.kind) {
    case "unknown":
      return;
    case "boolean":
      if (typeof unvalidated === "boolean") {
        return;
      }
      throw `Expected boolean, but got ${unvalidated}`;
    case "number":
      if (typeof unvalidated === "number") {
        return;
      }
      throw `Expected number, but got ${unvalidated}`;
    case "string":
      if (typeof unvalidated === "string") {
        return;
      }
      throw `Expected string, but got ${unvalidated}`;
    case "enum":
      if (spec.exact === unvalidated) {
        return;
      }
      throw `Expected "${spec.exact}", but got ${unvalidated}`;
    case "array":
      if (Array.isArray(unvalidated)) {
        for (const nestedUnvalidated of unvalidated) {
          validateAccordingToSchemaUntyped(spec.nested, nestedUnvalidated);
        }
        return;
      }
      throw `Expected array, but got ${unvalidated}`;
    case "object":
      if (unvalidated != null && typeof unvalidated === "object") {
        for (const [key, value] of Object.entries(unvalidated)) {
          const nestedSpec = spec.nested[key];
          if (nestedSpec != null) {
            validateAccordingToSchemaUntyped(nestedSpec, value);
          }
        }
        return;
      }
      throw `Expected array, but got ${unvalidated}`;
    case "union":
      for (const candidateSpec of spec.variants) {
        try {
          validateAccordingToSchemaUntyped(candidateSpec, unvalidated);
          return;
        } catch {}
      }
      throw "Cannot match any variant.";
    default:
      spec satisfies never;
  }
}

export function validateAccordingToSchema<const Spec extends FieldSpec>(
  spec: Spec,
  unvalidated: unknown,
): FieldSpecToType<Spec> {
  validateAccordingToSchemaUntyped(spec, unvalidated);
  return unvalidated as ConditionalTypeAny;
}
