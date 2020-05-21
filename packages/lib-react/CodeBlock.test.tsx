import React from 'react';

import renderer from 'react-test-renderer';

import CodeBlock from 'lib-react/PrismCodeBlock';

const createSamLangTest = (name: string, code: string) => {
  it(`CodeBlock rendering "${name}" matches snapshot.`, () => {
    const tree = renderer.create(<CodeBlock language="samlang">{code}</CodeBlock>).toJSON();
    expect(tree).toMatchSnapshot();
  });
};

// Examples from samlang.developersam.com

const helloWorld = `
class Main {
  function main(): string = "Hello World"
}
`;

const fortyTwo = `
class Main {
  function main(): int = 2 * 21
}
`;

const patternMatching = `
class Option<T>(None(unit), Some(T)) {

  public function <T> getNone(): Option<T> = None(unit)

  public function <T> getSome(d: T): Option<T> = Some(d)

  public method <R> map(f: (T) -> R): Option<R> =
      match (this) {
          | None _ -> None(unit)
          | Some d -> Some(f(d))
      }

}
`;

const typeInference = `
class TypeInference {

  function notAnnotated(): unit =
      val _ = (a, b, c) -> if a(b + 1) then b else c;

  // Read the docs to see how we do the type inference.
  function annotated(): unit =
      val _: ((int) -> bool, int, int) -> int =
          (a: (int) -> bool, b: int, c: int) -> (
              if a(b + 1) then b else c
          );

}
`;

createSamLangTest('Hello World', helloWorld);
createSamLangTest('42', fortyTwo);
createSamLangTest('Pattern Matching', patternMatching);
createSamLangTest('Type Inference', typeInference);
