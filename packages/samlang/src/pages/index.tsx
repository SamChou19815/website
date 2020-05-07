/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import classnames from 'classnames';

import styles from './styles.module.css';

const HELLO_WORLD_CODE = `class Main {
  function main(): string = "Hello World"
}
`;

const FOURTY_TWO_CODE = `class Main {
  function main(): int = 2 * 21
}
`;

const PATTERN_MATCHING_CODE = `class Option<T>(None(unit), Some(T)) {

  function <T> getNone(): Option<T> = None(unit)

  function <T> getSome(d: T): Option<T> = Some(d)

  method <R> map(f: (T) -> R): Option<R> =
    match (this) {
      | None _ -> None(unit)
      | Some d -> Some(f(d))
    }

}
`;

const TYPE_INFERENCE_CODE = `class TypeInference {
  function notAnnotated(): unit = {
    val _ = (a, b, c) -> if a(b + 1) then b else c;
  }

  // Read the docs to see how we do the type inference.
  function annotated(): unit = {
    val _: ((int) -> bool, int, int) -> int =
      (a: (int) -> bool, b: int, c: int) -> (
        if a(b + 1) then b else c
      );
  }
}
`;

const features = [
  {
    title: 'Hello World',
    code: HELLO_WORLD_CODE,
  },
  {
    title: '42',
    code: FOURTY_TWO_CODE,
  },
  {
    title: 'Pattern Matching',
    code: PATTERN_MATCHING_CODE,
  },
  {
    title: 'Type Inference',
    code: TYPE_INFERENCE_CODE,
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames('button button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/introduction')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({ title, code }) => (
                  <div
                    key={title}
                    className={classnames('col col--6', styles.feature, styles.CodeBlockWrapper)}
                  >
                    <h3>{title}</h3>
                    <CodeBlock className="samlang">{code}</CodeBlock>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
