// @flow strict

import type { Node } from 'react';
import React from 'react';
import CodeBlock from './CodeBlock';
import styles from './FirstPageCodeBlock.module.css';

const code = `
/**
 * © 2015–2019 Developer Sam.
 *
 * @author sam
 */

// Basic information of sam, written in SAMLANG.
// The code below is a well-typed SAMLANG program.
// Try it by yourself at
// https://samlang-demo.developersam.com
 
class Birthday(year: int, month: int, day: int) {
  public function ofSam(): Birthday =
    { year: 1998, month: 11, day: 15 }
}
class Developer(
  name: string, university: string,
  github: string, birthday: Birthday,
) {
  public function sam(): Developer =
    val university = "Cornell University";
    val github = "SamChou19815";
    { 
      name: "Sam Zhou", university, github,
      birthday: Birthday::ofSam(),
    }
}
util Main {
  function main(): Developer = Developer::sam()
}
`;

export default (): Node => <CodeBlock className={styles.Block}>{code}</CodeBlock>;
