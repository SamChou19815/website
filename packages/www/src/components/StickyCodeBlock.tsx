import CodeBlock, { flexibleTheme } from 'lib-react-prism/PrismCodeBlock';
import React from 'react';

const code = `/**
 * Copyright (C) 2015-${new Date().getFullYear()} Developer Sam.
 *
 * @author sam
 */

// Basic information of sam, written in samlang.
// The code below is a well-typed samlang program.
// Try it by yourself at
// https://samlang.io/demo

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
  plain: { ...flexibleTheme.plain, backgroundColor: 'var(--ifm-background-color)' },
};

const StickyCodeBlock = (): JSX.Element => {
  return (
    <CodeBlock language="samlang" theme={patchedTheme} className="sticky-code-block">
      {code}
    </CodeBlock>
  );
};

export default StickyCodeBlock;
