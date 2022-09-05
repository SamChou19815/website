import PrismCodeBlock, { flexibleTheme } from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

const code = `/**
 * Copyright (C) 2015-${new Date().getFullYear()} Developer Sam.
 * @author sam
 *
 * Try it by yourself at
 * https://samlang.io/demo
 */

class Pair<A, B>(val a: A, val b: B)
class List<T>(Nil(unit), Cons(Pair<T, List<T>>)) {
  function <T> of(t: T): List<T> =
    List.Cons(Pair.init(t, List.Nil<T>({})))
  method cons(t: T): List<T> =
    List.Cons(Pair.init(t, this))
}
class Developer(
  val github: string, val projects: List<string>
) {
  function sam(): Developer = {
    val l = List.of("samlang").cons("...");
    val github = "SamChou19815";
    Developer.init(github, l)
  }
}
class Main {
  function main(): Developer = Developer.sam()
}`;

const patchedTheme = {
  ...flexibleTheme,
  plain: { ...flexibleTheme.plain, backgroundColor: 'var(--background-color)' },
};

export default function StickyCodeBlock(): JSX.Element {
  return (
    <PrismCodeBlock
      language="samlang"
      theme={patchedTheme}
      className="mx-auto my-0 text-xs leading-5 sm:text-sm"
    >
      {code}
    </PrismCodeBlock>
  );
}
