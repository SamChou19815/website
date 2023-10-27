import { expect, it } from "bun:test";
import parseArguments from "./arg-parse";

it("Invalid flag test", () => {
  expect(() => parseArguments({}, ["--foo"])).toThrow();
  expect(() => parseArguments({}, ["-a"])).toThrow();
});

it("boolean spec test", () => {
  expect(
    parseArguments({ foo: { kind: "boolean" }, bar: { kind: "boolean", short: "b" } }, [
      "--foo",
      "-b",
      "3",
    ]),
  ).toEqual({
    positionals: ["3"],
    spec: { foo: true, bar: true },
  });
  expect(
    parseArguments({ foo: { kind: "boolean" }, bar: { kind: "boolean", short: "b" } }, []),
  ).toEqual({
    positionals: [],
    spec: {},
  });
});

it("number spec test", () => {
  expect(
    parseArguments({ foo: { kind: "number" }, bar: { kind: "number", short: "b" } }, [
      "--foo",
      "33",
      "-b",
      "3",
    ]),
  ).toEqual({
    positionals: [],
    spec: { foo: 33, bar: 3 },
  });
  expect(
    parseArguments(
      { foo: { kind: "number", default: 2 }, bar: { kind: "number", short: "b", default: 12 } },
      [],
    ),
  ).toEqual({
    positionals: [],
    spec: { bar: 12, foo: 2 },
  });
  expect(() =>
    parseArguments(
      { foo: { kind: "number" }, bar: { kind: "number", short: "b", default: 12 } },
      [],
    ),
  ).toThrow();
  expect(() => parseArguments({ foo: { kind: "number" } }, ["--foo"])).toThrow();
  expect(() =>
    parseArguments({ foo: { kind: "number" }, bar: { kind: "number", short: "b" } }, [
      "--foo",
      "dd",
    ]),
  ).toThrow();
});

it("string spec test", () => {
  expect(
    parseArguments({ foo: { kind: "string" }, bar: { kind: "string", short: "b" } }, [
      "--foo",
      "33",
      "-b",
      "3",
    ]),
  ).toEqual({
    positionals: [],
    spec: { foo: "33", bar: "3" },
  });
  expect(() => parseArguments({ foo: { kind: "string" } }, ["--foo"])).toThrow();
});

it("enum spec test", () => {
  expect(parseArguments({ foo: { kind: "enum", variants: ["a", "b"] } }, ["--foo", "a"])).toEqual({
    positionals: [],
    spec: { foo: "a" },
  });
  expect(parseArguments({ foo: { kind: "enum", variants: ["a", "b"] } }, ["--foo", "b"])).toEqual({
    positionals: [],
    spec: { foo: "b" },
  });
  expect(() =>
    parseArguments({ foo: { kind: "enum", variants: ["a", "b"] } }, ["--foo"]),
  ).toThrow();
  expect(() =>
    parseArguments({ foo: { kind: "enum", variants: ["a", "b"] } }, ["--foo", "c"]),
  ).toThrow();
});
