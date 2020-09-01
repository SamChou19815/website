---
id: architecture
title: Architecture
---

## Introduction

The source code sits in the [samlang](https://github.com/SamChou19815/samlang) repository. The
repository follows a monorepo setup, managed by Gradle multi-projects.

Most of the languages services are implemented in the Kotlin language, except a small TypeScript
adapter layer to support JavaScript targets. It is compiled by Kotlin multiplatform compiler into
JVM bytecode and JavaScript.

## Program Logic Flow

To produce a source set (defined by `sconfig.json`) into an optimized compiled native program, the
SAMLANG CLI performs following computation in order:

1. `samlang-cli` collects all sources specified by `sconfig.json` and stores a mapping from
   `ModuleReference` to source code in `String` (`Map<ModuleReference, String>`).
2. `samlang-core/parser` parses the sources code into AST's. Each source file is parsed into a
   `Module`. Then the in-memory representation becomes `Map<ModuleReference, Module>`. At this
   point, the `field` in each AST node is dummy.
3. `samlang-core/checker` type checks the modules by a constraint-solving based type inference
   algorithm. After that, the in-memory representation is still `Map<ModuleReference, Module>`, but
   each node in the AST is guaranteed to have a correct `type` field.
4. `samlang-core/compiler` gradually turns the source-level AST into assembly AST. It first lowers
   the AST into a high-level IR. The high level IR can be translated into other high-level languages
   without much effort. Then it lowers the AST into mid-level IR that is similar to Appel's IR. Then
   `samlang-core/compiler/asm-toplevel-generator` performs instruction selection to translate IR
   into abstract assembly. In both stages, `samlang-analysis` will perform some dataflow analysis,
   which will be consumed by `samlang-core/optimization` to perform various optimizations. Register
   allocation will be performed at the end.
5. `samlang-core/printer` prints the assembly AST into assembly files.
6. `samlang-cli` then shells out to `runtime` folder that links the assembly against the SAMLANG
   runtime. Now you get a program that is directly runnable!
