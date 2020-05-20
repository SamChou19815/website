import React, { ReactElement } from 'react';

import CodeBlock from 'lib-react/PrismCodeBlock';

import styles from './FirstPageCodeBlock.module.css';

const code = `

/**
 * Copyright (C) 2015–2020 Developer Sam.
 *
 * @author sam
 */

// Basic information of sam, written in SAMLANG.
// The code below is a well-typed SAMLANG program.
// Try it by yourself at
// https://samlang-demo.developersam.com

class List<T>(Nil(unit), Cons([T * List<T>])) {
  function <T> of(t: T): List<T> =
    Cons([t, Nil({})])
  method cons(t: T): List<T> =
    Cons([t, this])
}
class Developer(
  val name: string, val github: string,
  val projects: List<string>,
) {
  function sam(): Developer = {
    val l = List.of("SAMLANG").cons("...")
    val github = "SamChou19815"
    { name: "Sam Zhou", github, projects: l }
  }
}
class Main {
  function main(): Developer = Developer.sam()
}
`;

export default (): ReactElement => (
  <CodeBlock language="samlang" className={styles.Block}>
    {code}
  </CodeBlock>
);
