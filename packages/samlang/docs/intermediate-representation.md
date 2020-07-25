---
id: intermediate-representation
title: Intermediate Representation
---

samlang follows the standard compiler approach. We don't compile the source level samlang directly
into assembly. Instead, we construct different IRs (intermediate representation) to gradually
compile a functional language down to machine level assembly.

samlang has two IRs: high-level IR and mid-level IR. The low-level IR is the assembly itself.
Inside the codebase, high-level IR is often abbreviated as HIR and mid-level IR is abbreviated as
MIR. Constructors of high-level and mid-level IR are prefixed with `HIR_` and `MIR_` to
differentiate them to prevent accidental usage.

## Background

The high level IR is originally designed to simulate industry programming languages that have
object oriented features, like Java and TypeScript. In fact, they are originally modeled after them,
so that compiling from HIR to Java/TypeScript can be as easy as calling a bunch of recursive
`toString` methods. At that time, the HIR is the only IR so it's just called IR.

Since the support for compiling samlang to Java and TypeScript been dropped in favor of compiling
directly down to x86-64 assembly, the HIR has undergone a significant refactoring. Now, both the
high-level IR and mid-level IR become more similar to
[Appel's IR](https://www.cs.cornell.edu/courses/cs4120/2020sp/lectures/14irgen/lec14-sp16.pdf).

Currently, the design philosophy of HIR and MIR language can be summarized as follows:

HIR should be as close to machine level as possible, except that it should still be able to
compile to a high-level untyped language like C with void pointers or JavaScript. MIR should close
the remaining gap, where labels, jumps, and raw pointer arithmetics are allowed.

## High-level IR

### HIR Expressions

- `HIR_INT(v)` represents a 64-bit integer literal with value `v`;
- `HIR_STRING(s)` represents a string literal with content `s`;
- `HIR_NAME(n)` represents a global constant with name `n`. A function name is considered as a
  global constant.
- `HIR_VARIABLE(n)` represents a local variable with name `n`.
- `HIR_INDEX_ACCESS(e, i)` has the same semantics of array index access (`e[i]`) in most languages.
  There will be no index out of bound checks, since it's an invariant that all emitted
  `HIR_INDEX_ACCESS` is statically known to be type-safe.
- `HIR_BINARY(op, e1, e2)` is a binary expression`

### HIR Statements

- `HIR_FUNCTION_CALL(funExpr, funArgs, returnCollector)` is a statement like
  `let returnCollector = funExpr(...funArgs);` in JavaScript. The `returnCollector` must always
  specified. Useless values will be discarded in later optimization stages.
- `HIR_IF_ELSE(boolCondition, s1, s2)` is similar to if-else statements in imperative languages.
  `s1` and `s2` are lists of statements to execute in true branch and false branch respectively.
- `HIR_LET(name, assigned)` represents variable assignment `name := assigned`. Its semantics is
  same as JavaScript's `var` statement, where the variable is function scoped instead of block
  scoped.
- `HIR_RETURN(expr)` represents the return statement. The returned expression `expr` is optional.
- `HIR_STRUCT_INITIALIZATION(name, exprList)` is like `name = [...exprList]` in JavaScript.
  This construct is widely used to represent various source-level concepts, like objects, variants,
  and function closures. In this process, source-level objects' field names are completely erased,
  and values are put into various slots in the process.
