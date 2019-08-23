---
id: type-inference
title: Type Inference
---

The only required type annotated happens at the top-level module function and method level. The
type-checker can infer most of the types at the local level.

Here is a simple example to show you the power of the type-inference algorithm:

The type checker can correctly deduce the type of lambda `(a, b, c) -> if a(b + 1) then b else c`
must be `((int) -> bool, int, int) -> int`.

The type-checker first decides that `b` must be `int` since `+` adds up two `int`s. Then it knows
that `c` must also be `int`, because `b` and `c` must have the same type. From the syntax, `a` must
be a function. Since the function application of `a` happens at the boolean expression part of `if`,
we know it must return `bool`. Since `a` accepts one argument that is `int`, the type of `a` must
be `(int) -> bool`.

Although the type-checker is smart, in some cases it simply cannot determine the type because there
is not enough information.

```samlang
class NotEnoughTypeInfo {
    function <T> randomFunction(): T = panic("I can be any type!")
    function main(): unit = val _ = randomFunction();
}
```

The type of `randomFunction()` cannot be decided. We decide not to make it generic because we want
every expression to have a concrete type. Therefore, the type-checker will reject this program and
complain that there is not enough context to decide the type of each expression.
