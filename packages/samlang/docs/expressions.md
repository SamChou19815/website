# Expressions

The expressions are listed in order of precedence so you know where to add parenthesis.

## Literal

These are all valid literals: `42`, `true`, `false`, `"aaa"`.

These are not: `3.14`, `'c'`.

## This

The syntax is simple: `this`. It can be only used inside a method.

## Variable

You can refer to a local variable or function parameter just by typing its name. For example, you
can have:

```samlang
function identity(a: int): int = a
```

or

```samlang
function random(): int = {
  val a = 42; // very random
  a
}
```

## Class Function

You can refer to a module function by `ModuleName.functionName`.

For example, you can write:

```samlang
class Foo(a: int) {
  public function bar(): int = 3
}

class Main {
  function oof(): int = 14
  function main(): int = Foo.bar() * Main.oof()
}
```

## Tuple

You can construct a tuple by surrounding a list of comma separated expressions with `[]`.

- This is a tuple: `[1, 2]`;
- This is also a tuple: `["foo", "bar", true, 42]`;
- This is a tuple that is not fully evaluated: `[3 + 4, true && false]`;
- Tuples can live inside another tuple: `[["hi", "how"], ["are", "you"]]`;

## Variant

A variant constructor is like a function, but it must start with an uppercase letter: `Some(42)`.

## Field Access

You can access a field simply by using the dot syntax: `expr.name`. Note that you can only access
the field within the class. You always need to use this syntax to access the field. i.e. `this.name`
and `field` refer to different things.

## Method Access

You can access a method by using the `.` syntax: `expr.map`.

## Unary Expressions

- Negation: `-42`, `-(-42)`
- Not: `!true`, `!(!(false))`

## Panic Expression

You can think of panic as a special function that has a generified type: `<T>() -> T`. It's purpose
is to throw an _unchecked_ exception with a specified message. For example, you can write:

```samlang
function div(a: int, b: int): int =
  if b == 0 then (
    panic("Division by zero is illegal!")
  ) else (
    a / b
  )
```

When you do something illegal (e.g. division by zero), the interpreter may decide to panic.

## Built-in Function Call

There are three built-in functions:

- `stringToInt: (string) -> int`. It will panic if the given string cannot be converted to int.
- `intToString: (int) -> string`
- `println: (string) -> unit`

You can directly call them in samlang code.

## Function Call

You can call a function as you would expect: `functionName(arg1, arg2)`.

However, you don't need to have a function name: a lambda can also be used: `((x) -> x)(3)`.

Currying is not supported.

## Binary Expressions

Here are the supported ones:

- `a * b`, `a / b`, `a % b`, `a + b`, `a - b`: `a` and `b` must be `int`, and the result is `int`;
- `a < b`, `a <= b`, `a > b`, `a >= b`: `a` and `b` must be `int`, and the result is `bool`;
- `a == b`, `a != b`: `a` and `b` must have the same type, and the result is `bool.`;
- `a && b`, `a || b`: `a` and `b` must be `bool`, and the result is `bool`;
- `a::b` (string concatenation of `a` and `b`): `a` and `b` must be `string`, and the result is
  `string`.

## If-Else Expressions

In samlang, we don't have ternary expression, because if-else blocks are expressions.

You can write: `if a == b then c else d`. `c` and `d` must have the same type and the result has the
same type as `c` and `d`.

## Match Expressions

Suppose you have a variant type like `class Option<T>(None(unit), Some(T)) {}`. You can match on it
like:

```samlang
function matchExample(opt: Option<int>): int =
  match (opt) {
    | None _ -> 42
    | Some a -> a
  }
```

Pattern matching must be exhaustive. For example, the following code will have a compile-time error:

```samlang
function badMatchExample(opt: Option<int>): int =
  match (opt) {
    | None _ -> 42
    // missing the Some case, bad code
  }
```

## Lambda

You can easily define an anonymous function as a lambda. Here is the simpliest one: `() -> 0`. Here
is a more complex one: identity function `(x) -> x`. Note that the argument must always be
surrounded by parenthesis.

You can optionally type-annotate some parameters: `(x: int, y) -> x + y`.

## Statement Block Expression

You can define new local variables by using the val statement within a block of statements:

```samlang
class Obj(val d: int, val e: int) {
  function valExample(): int = {
    val a: int = 1;
    val b = 2;
    val [_, c] = ["dd", 3];
    val { e as d } = { d: 5, e: 4 }
    val _ = 42;
    a + b * c / d
  }
}
```

The above example shows various usages of val statement. You can choose to type-annotate the pattern
(variable, tuple, object, or wildcard), destruct on tuples or object, and ignore the output by using
wildcard (supported in tuple pattern and wildcard pattern). Note that the semicolon is optional.

Statement blocks can be nested:

```samlang
function nestedBlocks(): int = {
  val a = {
    val b = 4;
    val c = {
      val d = b;
      b
    };
    b
  };
  a + 1
}
```

You can create a `unit` value by `{}`.
