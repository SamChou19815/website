import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

const PAGE_DOCS_CONTENT = (
  <section className="docs-container">
    <article>
      <h2 id="introduction">Introduction</h2>
      <p>
        samlang is a statically-typed functional programming language designed and implemented by
        Sam Zhou. The language is still under development so the syntax and semantics may be changed
        at any time.
      </p>
      <p>The language can be compiled down to X86 assembly and machine code.</p>
      <h3>Getting Started</h3>
      <PrismCodeBlock language="bash">
        {'yarn add @dev-sam/samlang-cli\nyarn samlang --help'}
      </PrismCodeBlock>
      <h3>Program Layout</h3>
      <p>Here is an example program:</p>
      <PrismCodeBlock language="samlang">
        {`class HelloWorld(val message: string) {
private method getMessage(): string = {
  val { message } = this;
  message
}

function getGlobalMessage(): string = {
  val hw = { message: "Hello World" };
  hw.getMessage()
}
}

class Main {
function main(): string = HelloWorld.getGlobalMessage()
}
`}
      </PrismCodeBlock>
      <p>
        A module contains a list of classes, and a class can either be a normal class or utility
        class, which will be explained later. If there is a module named <code>{`Main`}</code>, then
        the entire program will be evaluated to the evaluation result of the function call{' '}
        <code>{`Main.main()`}</code>. If there is no such module, then the evaluation result will be{' '}
        <code>{`unit`}</code>.
      </p>
      <p>
        Each <code>{'.sam'}</code> source file defines a module. You can use a different module
        {"'"}s classes by <code>{`import`}</code>.
      </p>
      <PrismCodeBlock language="samlang">
        {`import { ClassA, ClassB } from Foo.Bar.Module
import { ClassC, ClassD } from Baz.Foo.Module

class ClassD {
function main(): int = ClassA.value() + ClassC.value()
}
`}
      </PrismCodeBlock>
      <p>
        Cyclic dependencies and mutual recursion between different classes are allowed. However,
        cyclic dependencies between modules are strongly discouraged.
      </p>

      <h2>Classes and Types</h2>
      <h3>Utility Class</h3>
      <p>
        We first introduce the simplest utility class. Utility classes serve as collections of
        functions. For example, we should put some math functions inside a utility class. i.e.
      </p>
      <PrismCodeBlock language="samlang">
        {`class Math {
function plus(a: int, b: int): int = a + b
function cosine(angleInDegree: int): int = panic("Not supported!")
}`}
      </PrismCodeBlock>
      <p>
        Here you see how you would define functions. Each top-level function defined in the class
        should have type-annotations for both arguments and return type for documentation purposes.
        The return value is written after the <code>=</code> sign. Note that we don{"'"}t have the{' '}
        <code>{`return`}</code> keyword because everything is an expression.
      </p>
      <p>A utility class is implicitly a class with no fields.</p>
      <p>
        There is a special kind of function called <em>method</em>. You can define methods in
        utility classes although they are not very useful.
      </p>
      <h3>Primitive and Compound Types</h3>
      <p>
        You already see two several <em>primitive</em> types: <code>string</code> and{' '}
        <code>int</code>. There are 4 kinds of primitive types: <code>unit</code>, <code>int</code>,{' '}
        <code>string</code>, <code>bool</code>.
      </p>
      <p>
        The <code>{`unit`}</code> type has only one possible value, which is <code>{'{}'}</code>. It
        is usually an indication of some side effects. The <code>{`int`}</code> type includes all
        64-bit integers. The string type includes all the strings quoted by double-quotes, like{' '}
        <code>{`"Hello World!"`}</code>. The <code>{`bool`}</code> types has two possible values:{' '}
        <code>{`true`}</code> and <code>{`false`}</code>.
      </p>
      <p>
        {`samlang enables you to use these primitive types to construct more complex types. You can also have
tuple types like `}
        <code>{`[int, bool, string]`}</code>
        {` and function types like `}
        <code>{`((int) -> int, int) -> int`}</code>
        {`.`}
      </p>
      <p>{`You may want to have some named tuple so that the code is more readable. samlang allows that by
letting you create an object class.`}</p>
      <h3>Object Class</h3>
      <p>
        Here we introduce the first kind of class: <em>object class</em>. You can define it like
        this:
      </p>
      <PrismCodeBlock language="samlang">
        {`class Student(private val name: string, val age: int) {
method getName(): string = this.name
private method getAge(): int = this.age
function dummyStudent(): Student = { name: "RANDOM_BABY", age: 0 }
}`}
      </PrismCodeBlock>
      <p>
        The class shown above defines a function, 2 methods, and a type <code>{`Student`}</code>.
        You can see that the type <code>{`Student`}</code> is already used in the type annotation of{' '}
        <code>{`dummyStudent`}</code> function. You can create a student object by the JavaScript
        object syntax as shown above. This kind of expression can only be used inside the class.
      </p>
      <p>
        You can also see methods defined here. You can think of method as a special kind of function
        that has an implicit <code>this</code> passes as the first parameter. (You cannot name{' '}
        <code>this</code> as a parameter name because it is a keyword.)
      </p>
      <p>
        The <code>{`private`}</code> keyword tells the type-checker that this function, field or
        method cannot be used outside of the class that defines it.
      </p>
      <h3>Variant Class</h3>
      <p>{`An object class defines a producct type; a variant class defines a sum type. With variant
class, you can define a type that can be either A or B or C. Here is an example:`}</p>
      <PrismCodeBlock language="samlang">
        {`class PrimitiveType(
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
}`}
      </PrismCodeBlock>
      <p>
        Inside the class, you can construct a variant by <code>{`VariantName(expr)`}</code>.
      </p>
      <p>
        Each variant carries some data with a specific type. To perform a case-analysis on different
        possibilities, you can use the <code>{`match`}</code> expression to pattern match on the
        expression.
      </p>
      <h3>Generics</h3>
      <p>Generics is supported in all kinds of classes. Here are some examples.</p>
      <PrismCodeBlock language="samlang">
        {`class FunctionExample {
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
}`}
      </PrismCodeBlock>
      <h2>Expressions</h2>
      <p>{`The expressions are listed in order of precedence so you know where to add parenthesis.`}</p>
      <h3>Literal</h3>
      <p>
        These are all valid literals: <code>{`42`}</code>, <code>{`true`}</code>,{' '}
        <code>{`false`}</code>, <code>{`"aaa"`}</code>.
      </p>
      <p>
        These are not: <code>{`3.14`}</code>, <code>{`'c'`}</code>.
      </p>
      <h3>This</h3>
      <p>
        The syntax is simple: <code>{`this`}</code>. It can be only used inside a method.
      </p>
      <h3>Variable</h3>
      <p>
        You can refer to a local variable or function parameter just by typing its name. For
        example, you can have:
      </p>
      <PrismCodeBlock language="samlang">{'function identity(a: int): int = a'}</PrismCodeBlock>
      <p>or</p>
      <PrismCodeBlock language="samlang">
        {`function random(): int = { val a = 42; a }`}
      </PrismCodeBlock>
      <h3>Class Function</h3>
      <p>
        You can refer to a class function by <code>{`ClassName.functionName`}</code>.
      </p>
      <p>For example, you can write:</p>
      <PrismCodeBlock language="samlang">
        {`class Foo(a: int) {
public function bar(): int = 3
}

class Main {
function oof(): int = 14
function main(): int = Foo.bar() * Main.oof()
}`}
      </PrismCodeBlock>
      <h3>Tuple</h3>
      <p>
        You can construct a tuple by surrounding a list of comma separated expressions with{' '}
        <code>{`[]`}</code>.
      </p>
      <ul>
        <li>
          This is a tuple: <code>{`[1, 2]`}</code>;
        </li>
        <li>
          This is also a tuple: <code>{`["foo", "bar", true, 42]`}</code>;
        </li>
        <li>
          Tuples can live inside another tuple: <code>{`[["hi", "how"], ["are", "you"]]`}</code>;
        </li>
      </ul>
      <h3>Variant</h3>
      <p>
        A variant constructor is like a function, but it must start with an uppercase letter:{' '}
        <code>{`Some(42)`}</code>.
      </p>
      <h3>Field/Method Access</h3>
      <p>
        You can access a field/method simply by using the dot syntax: <code>{`expr.name`}</code>.
        You always need to use this syntax to access the field. i.e. <code>{`this.field`}</code> and{' '}
        <code>{`field`}</code> refer to different things.
      </p>
      <h3>Unary Expressions</h3>
      <ul>
        <li>
          Negation: <code>{`-42`}</code>, <code>{`-(-42)`}</code>
        </li>
        <li>
          Not: <code>{`!true`}</code>, <code>{`!(!(false))`}</code>
        </li>
      </ul>
      <h3>Function Call</h3>
      <p>
        You can call a function as you would expect: <code>{`functionName(arg1, arg2)`}</code>.
      </p>
      <p>
        However, you do not need to have a function name: a lambda can also be used:{' '}
        <code>{`((x) -> x)(3)`}</code>.
      </p>
      <p>Currying is not supported.</p>
      <h3>Binary Expressions</h3>
      <p>Here are the supported ones:</p>
      <ul>
        <li>
          <code>{`a * b, a / b, a % b, a + b, a - b`}</code>
          {`: `}
          <code>{`a`}</code> and <code>{`b`}</code> must be int, and the result is int;
        </li>
        <li>
          <code>{`a < b, a <= b, a > b, a >= b`}</code>
          {`: `}
          <code>{`a`}</code> and <code>{`b`}</code> must be int, and the result is bool;
        </li>
        <li>
          <code>{`a == b, a != b`}</code>
          {`: `}
          <code>{`a`}</code> and <code>{`b`}</code> must have the same type, and the result is bool;
        </li>
        <li>
          <code>{`a && b, a || b`}</code>
          {`: `}
          <code>{`a`}</code> and <code>{`b`}</code> must be bool, and the result is bool;
        </li>
        <li>
          <code>{`a::b`}</code> (string concatenation of a and b)
          {': '}
          <code>{`a`}</code> and <code>{`b`}</code> must be string, and the result is string.
        </li>
      </ul>
      <h3>If-Else Expressions</h3>
      <p>In samlang, we do not have ternary expression, because if-else blocks are expressions.</p>
      <p>
        You can write: <code>{`if a == b then c else d`}</code>. <code>{`c`}</code> and{' '}
        <code>{`d`}</code> must have the same type and the result has the same type as{' '}
        <code>{`c`}</code> and <code>{`d`}</code>.
      </p>
      <h3>Match Expressions</h3>
      <p>
        Suppose you have a variant type like{' '}
        <code>{`class Option<T>(None(unit), Some(T)) {}`}</code>. You can match on it like:
      </p>
      <PrismCodeBlock language="samlang">
        {`function matchExample(opt: Option<int>): int =
match (opt) {
  | None _ -> 42
  | Some a -> a
}`}
      </PrismCodeBlock>
      <p>
        Pattern matching must be exhaustive. For example, the following code will have a
        compile-time error:
      </p>
      <PrismCodeBlock language="samlang">
        {`function badMatchExample(opt: Option<int>): int =
match (opt) {
  | None _ -> 42
  // missing the Some case, bad code
}`}
      </PrismCodeBlock>
      <h3>Lambda</h3>
      <p>
        You can easily define an anonymous function as a lambda. Here is the simpliest one:{' '}
        <code>{`() -> 0`}</code>. Here is a more complex one: identity function:{' '}
        <code>{`(x) -> x`}</code>. Note that the argument must always be surrounded by parenthesis.
      </p>
      <p>
        You can optionally type-annotate some parameters: <code>{`(x: int, y) -> x + y`}</code>.
      </p>
      <h3>Statement Block Expression</h3>
      <p>
        You can define new local variables by using the val statement within a block of statements:
      </p>
      <PrismCodeBlock language="samlang">
        {`class Obj(val d: int, val e: int) {
function valExample(): int = {
  val a: int = 1;
  val b = 2;
  val [_, c] = ["dd", 3];
  val { e as d } = { d: 5, e: 4 }
  val _ = 42;
  a + b * c / d
}
}`}
      </PrismCodeBlock>
      <p>
        The above example shows various usages of val statement. You can choose to type-annotate the
        pattern (variable, tuple, object, or wildcard), destruct on tuples or object, and ignore the
        output by using wildcard (supported in tuple pattern and wildcard pattern). Note that the
        semicolon is optional.
      </p>
      <p>Statement blocks can be nested:</p>
      <PrismCodeBlock language="samlang">
        {`function nestedBlocks(): int = {
val a = {
  val b = 4;
  val c = {
    val d = b;
    b
  };
  b
};
a + 1
}`}
      </PrismCodeBlock>
      <p>
        You can create a <code>{`unit`}</code> value by <code>{`{}`}</code>.
      </p>
      <h2>Type Inference</h2>
      <p>
        The only required type annotated happens at the top-level class function and method level.
        The type-checker can infer most of the types at the local level.
      </p>
      <p>Here is a simple example to show you the power of the type-inference algorithm:</p>
      <p>
        The type checker can correctly deduce the type of lambda{' '}
        <code>{`(a, b, c) -> if a(b + 1) then b else c`}</code> must be{' '}
        <code>{`((int) -> bool, int, int) -> int`}</code>.
      </p>
      <p>
        The type-checker first decides that <code>{`b`}</code> must be <code>{`int`}</code> since{' '}
        <code>{`+`}</code> adds up two <code>{`int`}</code>s. Then it knows that <code>{`c`}</code>{' '}
        must also be <code>{`int`}</code>, because <code>{`b`}</code> and <code>{`c`}</code> must
        have the same type. From the syntax, <code>{`a`}</code> must be a function. Since the
        function application of <code>{`a`}</code> happens at the boolean expression part of{' '}
        <code>{`if`}</code>, we know it must return <code>{`bool`}</code>. Since <code>{`a`}</code>{' '}
        accepts one argument that is <code>{`int`}</code>, the type of <code>{`a`}</code> must be{' '}
        <code>{`(int) -> bool`}</code>.
      </p>
      <p>
        Although the type-checker is smart, in some cases it simply cannot determine the type
        because there is not enough information.
      </p>
      <PrismCodeBlock language="samlang">
        {`class NotEnoughTypeInfo {
  function <T> randomFunction(): T = panic("I can be any type!")
  function main(): unit = { val _ = randomFunction(); }
}`}
      </PrismCodeBlock>
      <p>
        The type of <code>{`randomFunction()`}</code> cannot be decided. We decide not to make it
        generic because we want every expression to have a concrete type. In this case, the type
        checker will instantiate the generic type <code>{`T`}</code> as <code>{`unit`}</code>.
      </p>
    </article>
  </section>
);

export default PAGE_DOCS_CONTENT;
