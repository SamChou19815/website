import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React from 'react';
import Docs from '../components/docs';
import SideNav from '../components/SideNav';

const HELLO_WORLD_CODE = `class HelloWorld {
  function getString(): string =
    "Hello World"
}`;

const FOURTY_TWO_CODE = `class Math {
  function answerToLife(): int =
    2 * 21
}`;

const PATTERN_MATCHING_CODE = `class Opt<T>(
  None(unit), Some(T)
) {
  method isEmpty(): bool =
    match (this) {
      | None _ -> true
      | Some _ -> false
    }

  method <R> map(f: (T) -> R): Opt<R> =
    match (this) {
      | None _ -> Opt.None({})
      | Some v -> Opt.Some(f(v))
    }
}`;

const TYPE_INFERENCE_CODE = `class TypeInference {
  function <A, B, C> pipe(
    a: A, f1: (A)->B, f2: (B)->C
  ): C = f2(f1(a))

  function main(): unit = {
    // n: int
    // s: string
    val _ = Main.pipe(
      1,
      (n) -> Builtins.intToString(n),
      (s) -> Builtins.stringToInt(s)
    )
  }
}`;

const features = [
  { title: 'Hello World', code: HELLO_WORLD_CODE },
  { title: '42', code: FOURTY_TWO_CODE },
  { title: 'Pattern Matching', code: PATTERN_MATCHING_CODE },
  { title: 'Type Inference', code: TYPE_INFERENCE_CODE },
];

export default function Home(): JSX.Element {
  return (
    <div className="homepage-container m-auto flex max-w-7xl flex-row">
      <SideNav />
      <main className="w-full overflow-hidden">
        <header
          className="my-4 mt-0 flex flex-col items-center bg-blue-500 px-8 py-12 text-white"
          id=""
        >
          <h1 className="my-8 flex text-6xl font-extralight">
            <img
              className="mr-3 rounded-full bg-white"
              src="/img/logo.png"
              alt="Logo"
              width="64px"
              height="64px"
            />
            samlang
          </h1>
          <p className="block text-left text-2xl font-light">
            A statically-typed, functional, and sound&nbsp;
            <br className="hidden sm:block" />
            programming language with type inference.
          </p>
        </header>
        <section className="my-4 flex flex-wrap items-center border border-solid border-gray-300 bg-white p-4">
          {features.map(({ title, code }) => (
            <div key={title} className="half-width-flex w-full p-2">
              <h3 id={`example-${title.toLowerCase().replaceAll(' ', '-')}`}>{title}</h3>
              <PrismCodeBlock language="samlang">{code}</PrismCodeBlock>
            </div>
          ))}
        </section>
        <Docs />
      </main>
    </div>
  );
}

Home.noJS = true;
