---
id: classes-types
title: Classes & Types
---

## Utility Class

We first introduce the simplest utility class. Utility classes serve as collections of functions.
For example, we should put some math functions inside a `Math` utility module. i.e.

```samlang
class Math {
  function plus(a: int, b: int): int = a + b
  function cosine(angleInDegree: int): int = panic("Not supported!")
}
```

Here you see how you would define functions. Each top-level function defined in the module should
have type-annotations for both arguments and return type for documentation purposes. The return
value is written after the `=` sign. Note that we don't have the `return` keyword because everything
is an expression.

A utility class is implicit a class with no fields.

There is a special kind of function called _method_. You can define methods in utility classes
although they are not very useful.

## Primitive and Compound Types

You already see two several _primitive_ types: `string` and `int`. There are 4 kinds of primitive
types: `unit`, `int`, `string`, `bool`.

The `unit` type has only one possible value, which is `{}`. It's usually an indication of some
side effects. The `int` type includes all 64-bit integers. The string type includes all the strings
quoted by double-quotes, like `"Hello World!"`. The `bool` types has two possible values: `true` and
`false`.

SAMLANG enables you to use these primitive types to construct more complex types. You can also have
tuple types like `[int, bool, string]` and function types like `((int) -> int, int) -> int`.

You may want to have some named tuple so that the code is more readable. SAMLANG allows that by
letting you create an object class module.

## Object Class Module

Here we introduce the first kind of class module: _object class module_. You can define it like
this:

```samlang
class Student(val name: string, val age: int) {
  method getName(): string = this.name
  private method getAge(): int = this.age
  function dummyStudent(): Student = { name: "RANDOM_BABY", age: 0 }
}
```

The module shown above defines a function, 2 methods, and a type `Student`. You can see that the
type `Student` is already used in the type annotation of `dummyStudent` function. You can create a
student object by the JavaScript object syntax as shown above. This kind of expression can only be
used inside the module.

You can also see methods defined here. You can think of method as a special kind of function that
has an implicit `this` passes as the first parameter. (You cannot name `this` as a parameter name
because it's a keyword.)

The `private` keyword tells the type-checker that this function or method cannot be used outside of
the class that defines it.

## Variant Class Module

Object class module defines a producct type; variant class module defines a sum type. With variant
class module, you can define a type that can be either A or B or C. Here is an example:

```samlang
class PrimitiveType(
    U(unit),
    I(int),
    S(string),
    B(bool),
) {
  // some random functions
  function getUnit(): PrimitiveType = U({})
  function getInteger(): PrimitiveType = I(42)
  function getString(): PrimitiveType = S("Answer to life, universe, and everything.")
  function getBool(): PrimitiveType = B(false)

  // pattern matching!
  method isTruthy(): bool =
    match this {
      | U _ -> false
      | I i -> i != 0
      | S s -> s != ""
      | B b -> b
    }
}
```

Inside the module, you can construct a variant by `VariantName(expr)`.

As shown in the example, you use `|` to separate different kinds of variant. Each variant carries
some data with a specific type. To perform a case-analysis on different possibilities, you can use
the `match` expression to pattern match on the expression.

## Generics

Generics is supported in all kinds of modules. Here are some examples.

```samlang
class FunctionExample {
  function <T> getIdentityFunction(): (T) -> T = (x) -> x
}

class Box<T>(val content: T) {
  function <T> init(content: T): Box<T> = { content } // object short hand syntax
  method getContent(): T = {
    val { content } = this; content
  }
}

class Option<T>(None(unit), Some(T)) {
  function <T> getNone(): Option<T> = None(unit)
  function <T> getSome(d: T): Option<T> = Some(d)

  method <R> map(f: (T) -> R): Option<R> =
    match (this) {
      | None _ -> None(unit)
      | Some d -> Some(f(d))
    }
}
```
