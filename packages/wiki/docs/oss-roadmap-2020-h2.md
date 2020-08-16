---
id: oss-roadmap-2020-h2
title: Open Source Roadmap 2020 H2
---

## samlang

### Compiler Backend

In H1, I dropped support for the Java/JS/TS backend and replaced it with X86 assembly backend.
This changes eliminated the need for an ugly and poorly maintained high IR AST. With recent
refactorings in place, we will be able to restore the support for JS backend. In particular, samlang
should be able to emit human-readable JavaScript with beautiful indentation.

With the recent Apple annoucement that Macs will be moving to ARM, we should start thinking about
moving away from X86 target. In this half, I aim to finish exploring the following viable
alternatives:

- LLVM
- WebAssembly
- JVM bytecode

### Type System

In H1, there is no significant changes to samlang's type system. In H2, I plan to reshift the focus
to the type system.

Currently, the only planned type system addition is interface types. If time permitted, I will start
working on functors. The implementation of interface type must consider the runtime support for both
existing code and functor related code.

### Optimization

Since we want to add JS backend support and JS is emitted directly from HIR, we should move as many
optimizations to HIR as possible. To accomplish this, we need to first unify the IR expressions in
HIR and MIR, and then refactor the control flow analysis framework to make it runnable on HIR.

If I have additional time, I may implement an additional loop related optimization.

## website

### Web Terminal

I plan to design a general purpose web terminal library to abstract away the implementation detail
of web terminals. The library should make defining new terminal commands easy.

While the terminal is becoming more powerful, I still plan to control the initial JS load size.
Therefore, I plan to first ensure all the web terminal related code is lazily loaded.

### Wiki

Currently, the wiki project is in a hacked-together state. The private build depends on file
structure in another private repository, which makes it impossible to do local static analysis.

In addition, the build time for the wiki project is quite long, because we pull in a lot of markdown
documents for compilation. It won't scale well when I added more docs to it.

In H2, I plan to mitigate the uncontrolled increase in build time. If time permitted, find way to
implement an access control mechanism that doesn't require non-local building.

## Infra and Tooling

### Linter

- Auditing every existing rules and eliminate dependencies on airbnb config;
- Make the linter config TypeScript first.

### Build System

Improve upon the current build system and achieve the following goals:

- Incremental build is fully consistent with full build;
- Incremental build's time complexity is `O(number of changes)`, to an extent allowed by the
  underlying compilers;
- Take advantage of samlang's Turing completeness to create expressive declarative build rules.

### Binary Building and Distribution Service

Create a service that can:

- Generating GitHub Actions configurations that automatically build and test binaries for all
  major operating systems from source and securely upload them to a remote file server;
- A CLI for local and CI that can download the binaries from remote on demand and cache them based
  on version hash.

### CI

- CI runtime for most jobs are under 30s, while the longest running job doesn't run over 1 min;
- Unify CI configurations for `samlang`, `website` and `private-monorepo`.

### Docusaurus

- Contributing upstream to Docusaurus to provide good TypeScript support;
- Contributing upstream to Docusaurus to make it fully Yarn V2 compatible;
- Investigating and implementing solutions that can fetch markdown documents and render them from
  remote server.

## Random

- Become proficient in Rust
- Rewrite critter compiler in Rust
- Keep `mini-react` up-to-date with current React
