import { relative, resolve } from 'path';

/* eslint-disable no-console */
class TestError extends Error {}

function compareExpectedAndActual(expected: unknown, actual: unknown) {
  if (expected === actual) return;
  throw new TestError(`Expected: ${expected}\nActual: ${actual}`);
}

class PartialExpect<T> {
  constructor(private readonly expected: T) {}

  toBe(actual: T): void {
    compareExpectedAndActual(this.expected, actual);
  }

  toBeNull(): void {
    this.toBe(null as unknown as T);
  }

  toEqual(actual: T): void {
    compareExpectedAndActual(
      JSON.stringify(this.expected, undefined, 2),
      JSON.stringify(actual, undefined, 2)
    );
  }

  toThrow() {
    if (typeof this.expected !== 'function') {
      throw new TestError('Expected value should be a function');
    }
    try {
      this.expected();
    } catch {
      return;
    }
    throw new TestError('Expected to throw.');
  }
}

class TestCase {
  constructor(readonly testDescription: string, private readonly runner: () => unknown) {}

  run() {
    const result = this.tryToRun();
    if (result == null) {
      console.error(`✅ ${this.testDescription}`);
      return true;
    }
    console.error(`❌ ${this.testDescription}`);
    console.error(`Error: ${result.e}`);
    console.error(`Stacktrace: ${result.stack}`);
    return false;
  }

  private tryToRun() {
    try {
      this.runner();
      return null;
    } catch (e) {
      if (!(e instanceof Error)) return { e, stack: 'unknown error type' };
      return { e, stack: e.stack };
    }
  }
}

const collectedTestCases: TestCase[] = [];

export function it(testDescription: string, runner: () => unknown): void {
  collectedTestCases.push(
    new TestCase(`${__INTERNAL__CURRENT_TEST_PATH} > ${testDescription}`, runner)
  );
}

export const expect = <T>(value: T): PartialExpect<T> => new PartialExpect(value);

let __INTERNAL__CURRENT_TEST_PATH = '';

export function __INTERNAL__SET_CURRENT_TEST_PATH(path: string): string {
  __INTERNAL__CURRENT_TEST_PATH = relative(resolve('.'), path);
  return path;
}

export function __INTERNAL__RUN_ALL_TEST_CASES__(): boolean {
  return collectedTestCases.map((testCase) => testCase.run()).every((passed) => passed);
}
