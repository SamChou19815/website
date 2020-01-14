---
id: introduction
title: Introduction
---

SAMLANG is a statically-typed functional programming language designed and implemented by Sam Zhou.
The language is still under development so the syntax and semantics may be changed at any time.

The language can be compiled down to X86 assembly and machine code.

## Program Layout

Here is an example program:

```samlang
class HelloWorld(message: string) {
  method getMessage(): string = {
    val { message } = this;
    message
  }

  public function getGlobalMessage(): string = {
    val hw = { message: "Hello World" };
    hw.getMessage()
  }
}

class Main {
  function main(): string = HelloWorld.getGlobalMessage()
}
```

A module contains a list of classes, and a class can either be a normal class or utility class,
which will be explained later. If there is a module named `Main` and the module contains a no-arg
function `main`, then the entire program will be evaluated to the evaluation result of the function
call `Main.main()`. If there is no such module, then the evaluation result will be `unit`.

Each `.sam` source file defines a module. You can use a different module's classes by `import`

```samlang
import { ClassA, ClassB } from Foo.Bar.Module
import { ClassC, ClassD } from Baz.Foo.Module

class ClassD {
    function main(): int = ClassA.value() + ClassC.value()
}
```

Cyclic dependencies and mutual recursion between different classes are allowed. However, cyclic
dependencies between modules are strongly discouraged.
