// @flow strict

import type { Node } from 'react';
import React from 'react';
import CodeBlock from '../Common/CodeBlock';
import styles from './FirstPageCodeBlock.module.css';

const code = `

/**
 * Copyright (C) 2015–2019 Developer Sam.
 *
 * @author sam
 */

// Basic information of sam, written in SAMLANG.
// The code below is a well-typed SAMLANG program.
// Try it by yourself at
// https://samlang-demo.developersam.com
 
class List<T>(Nil(unit), Cons([T * List<T>])) {
  public function <T> of(t: T): List<T> =
    Cons([t, Nil(unit)])
  public method cons(t: T): List<T> =
    Cons([t, this])
}
class Developer(
  name: string, github: string,
  projects: List<string>,
) {
  public function sam(): Developer =
    val l = List::of("SAMLANG")::cons("...");
    val github = "SamChou19815";
    { name: "Sam Zhou", github, projects: l }
}
util Main {
  function main(): Developer = Developer::sam()
}
`;

export default (): Node => <CodeBlock className={styles.Block}>{code}</CodeBlock>;
