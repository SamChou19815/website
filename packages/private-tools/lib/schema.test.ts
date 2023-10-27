import { expect, it } from "bun:test";
import { defineSchema, objectSchema, validateAccordingToSchema } from "./schema";

it("Integration test happy path", () => {
  const schema = defineSchema({
    kind: "union",
    variants: [
      objectSchema({
        foo: { kind: "string" },
        bar: { kind: "boolean" },
        baz: { kind: "number" },
        boo: { kind: "unknown" },
        arr: { kind: "array", nested: { kind: "enum", exact: "www" } },
      }),
      { kind: "string" },
    ],
  });
  const validated = validateAccordingToSchema(schema, {
    foo: "",
    bar: false,
    baz: 2,
    boo: Boolean,
    arr: ["www", "www"],
  });

  if (typeof validated !== "string") {
    expect(validated.foo).toBeString();
    expect(validated.bar).toBeFalse();
    expect(validated.baz).toBeNumber();
    expect(validated.boo).toBeTruthy();
    expect(validated.arr[0]).toBe("www");
    expect(validated.arr[1]).toBe("www");
  } else {
    throw "";
  }

  expect(validateAccordingToSchema(schema, "hi")).toBeString();
});

it("Failed invalidations", () => {
  expect(() => validateAccordingToSchema({ kind: "boolean" }, Boolean)).toThrow();
  expect(() => validateAccordingToSchema({ kind: "string" }, Boolean)).toThrow();
  expect(() => validateAccordingToSchema({ kind: "number" }, Boolean)).toThrow();
  expect(() => validateAccordingToSchema({ kind: "enum", exact: "www" }, Boolean)).toThrow();
  expect(() =>
    validateAccordingToSchema({ kind: "array", nested: { kind: "unknown" } }, Boolean),
  ).toThrow();
  expect(() => validateAccordingToSchema({ kind: "object", nested: {} }, Boolean)).toThrow();
  expect(() =>
    validateAccordingToSchema({ kind: "union", variants: [{ kind: "string" }] }, Boolean),
  ).toThrow();
});
