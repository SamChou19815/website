---
title: First Beta Version
---

The first beta version of SAMLANG is released. The expression level language features are mostly
fixed. Future versions will try to maintain backward-compatibility with best effort.

Features considered for future versions include:

- More visibility modifiers: `package-private`, `internal`, etc.
- Nullable types
- Interfaces (potentially with functors)
- Better optimizations with interprocedural analysis

If you have any ideas on what should be included in future releases, feel free to create GitHub
[issues](https://github.com/SamChou19815/samlang/issues/new) as feature requests. Please note that
not all requests will be granted. For example, all requests to make samlang dynamic will be
rejected, since samlang is a statically-typed language, and will remain statically-typed in the
future.

```samlang
class Main {
  function main(): unit = println("What features do you want?")
}
```
