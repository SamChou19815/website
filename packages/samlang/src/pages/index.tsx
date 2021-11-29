import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

import LanguageDemo from '../components/demo';
import Docs from '../components/docs';

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
    <div className="homepage-container">
      <div className="sidebar-container">
        <div className="navbar-items-block">
          <div className="navbar-toplevels">
            <a className="homepage-navlink brand" href="/#">
              <img className="logo" src="/img/logo.png" alt="Logo" />
              <strong className="navbar__title">samlang</strong>
            </a>
            <a className="homepage-navlink" href="#demo">
              Demo
            </a>
            <a
              className="homepage-navlink"
              href="https://github.com/SamChou19815/samlang"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
          <div>
            <a className="homepage-navlink" href="#introduction">
              Introduction
            </a>
            <a className="homepage-navlink" href="#getting-started">
              Getting Started
            </a>
            <a className="homepage-navlink" href="#program-layout">
              Program Layout
            </a>
            <a className="homepage-navlink" href="#classes-types">
              Classes and Types
            </a>
            <a className="homepage-navlink" href="#expressions">
              Expressions
            </a>
            <a className="homepage-navlink" href="#type-inference">
              Type Inference
            </a>
          </div>
        </div>
      </div>
      <main className="homepage-main-container">
        <header className="index-page-hero-banner" id="">
          <h1 className="hero-title">
            <img className="logo" src="/img/logo.png" alt="Logo" width="64px" height="64px" />
            samlang
          </h1>
          <p className="hero-subtitle">
            A statically-typed functional programming language with type inference.
          </p>
        </header>
        <section className="index-page-features">
          {features.map(({ title, code }) => (
            <div key={title} className="index-page-code-block-wrapper">
              <h3>{title}</h3>
              <PrismCodeBlock language="samlang">{code}</PrismCodeBlock>
            </div>
          ))}
        </section>
        <LanguageDemo />
        <Docs />
      </main>
    </div>
  );
}
