/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from 'esbuild-scripts/components/Link';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

const HELLO_WORLD_CODE = `class Main {
  function main(): string = "Hello World"
}`;

const FOURTY_TWO_CODE = `class Main {
  function main(): int = 2 * 21
}`;

const PATTERN_MATCHING_CODE = `class Option<T>(None(unit), Some(T)) {

  function <T> getNone(): Option<T> = None(unit)

  function <T> getSome(d: T): Option<T> = Some(d)

  method <R> map(f: (T) -> R): Option<R> =
    match (this) {
      | None _ -> None(unit)
      | Some d -> Some(f(d))
    }

}`;

const TYPE_INFERENCE_CODE = `class TypeInference {
  function notAnnotated(): unit = {
    val _ = (a, b, c) -> if a(b + 1) then b else c;
  }

  // Read the docs to see how we do the type inference.
  function annotated(): unit = {
    val _: ((int) -> bool, int, int) -> int =
      (a: (int) -> bool, b: int, c: int) -> (
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

const Home = (): JSX.Element => (
  <>
    <header className="hero hero--primary index-page-hero-banner">
      <div className="container">
        <h1 className="hero__title">samlang</h1>
        <p className="hero__subtitle">{"Sam's Programming Language"}</p>
        <div className="index-page-buttons">
          <Link className="button button--secondary button--lg" to="/docs/introduction">
            Get Started
          </Link>
        </div>
      </div>
    </header>
    <main>
      <section className="index-page-features">
        <div className="container">
          <div className="row">
            {features.map(({ title, code }) => (
              <div
                key={title}
                className="col col--6 index-page-features index-page-code-block-wrapper"
              >
                <h3>{title}</h3>
                <PrismCodeBlock language="samlang">{code}</PrismCodeBlock>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Home;
