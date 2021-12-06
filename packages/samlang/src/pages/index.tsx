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

const PATTERN_MATCHING_CODE = `class Option<T>(
  None(unit), Some(T)
) {
  method isEmpty(): bool =
    match (this) {
      | None _ -> true
      | Some _ -> false
    }
}`;

const TYPE_INFERENCE_CODE = `class TypeInference {
  function example(): unit = {
    // a: (int) -> bool
    // b: int, c: int
    val _ = (a, b, c) -> (
      if a(b + 1) then b else c
    );
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
    <div className="flex flex-row m-auto max-w-5xl homepage-container">
      <SideNav />
      <main className="overflow-hidden w-full">
        <header
          className="flex flex-col items-center my-4 mt-0 px-8 py-12 bg-blue-500 text-white"
          id=""
        >
          <h1 className="flex font-extralight text-6xl my-8">
            <img
              className="bg-white rounded-full mr-3"
              src="/img/logo.png"
              alt="Logo"
              width="64px"
              height="64px"
            />
            samlang
          </h1>
          <p className="block text-2xl text-left font-extralight">
            A statically-typed, functional, and sound&nbsp;
            <br className="hidden sm:block" />
            programming language with type inference.
          </p>
        </header>
        <section className="flex flex-wrap items-center bg-white my-4 p-4 border border-solid border-gray-300">
          {features.map(({ title, code }) => (
            <div key={title} className="p-2 w-full half-width-flex">
              <h3>{title}</h3>
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
