import React, { ReactElement } from 'react';

import { useSelector } from 'react-redux';

import { State } from '../store';
import styles from './StickyCodeBlock.module.css';

import CodeBlock, { darkTheme } from 'lib-react/PrismCodeBlock';

const code = `
/**
 * Copyright (C) 2015–2020 Developer Sam.
 *
 * @author sam
 */

// Basic information of sam, written in SAMLANG.
// The code below is a well-typed SAMLANG program.
// Try it by yourself at
// https://samlang.developersam.com/demo

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

const patchedDarkTheme = {
  ...darkTheme,
  plain: { ...darkTheme.plain, backgroundColor: 'var(--ifm-background-color' },
};

const StickyCodeBlock = (): ReactElement => {
  const theme = useSelector((state: State) => state.theme) === '' ? undefined : patchedDarkTheme;
  return (
    <CodeBlock language="samlang" theme={theme} className={styles.Block}>
      {code}
    </CodeBlock>
  );
};

export default StickyCodeBlock;
