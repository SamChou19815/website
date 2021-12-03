import PrismCodeBlock, { flexibleTheme } from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

const code = `/**
 * Copyright (C) 2015-${new Date().getFullYear()} Developer Sam.
 * @author sam
 *
 * Try it by yourself at
 * https://samlang.io/demo
 */

class List<T>(Nil(unit), Cons([T * List<T>])) {
  function <T> of(t: T): List<T> =
    Cons([t, Nil({})])
  method cons(t: T): List<T> =
    Cons([t, this])
}
class Developer(
  val name: string, val github: string,
  val projects: List<string>
) {
  function sam(): Developer = {
    val l = List.of("samlang").cons("...");
    val github = "SamChou19815";
    { name: "Sam Zhou", github, projects: l }
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
      className="leading-5 mx-auto my-0 text-xs sm:text-sm"
    >
      {code}
    </PrismCodeBlock>
  );
}
