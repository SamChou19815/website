import PrismCodeBlock, { flexibleTheme } from 'lib-react-prism/PrismCodeBlock';

const code = `/**
 * Copyright (C) 2015-${new Date().getFullYear()} Developer Sam.
 * @demo https://samlang.io/demo
 */

class Pair<A, B>(val a: A, val b: B)
class List<T>(Nil(unit), Cons(Pair<T, List<T>>)) {
  function <T> of(t: T): List<T> =
    List.Cons(Pair.init(t, List.Nil<T>({})))
  method cons(t: T): List<T> =
    List.Cons(Pair.init(t, this))
}
class Developer(
  val github: string,
  val company: string,
  val projects: List<string>,
) {
  function sam(): Developer = {
    val github = "SamChou19815";
    val company = "Facebook";
    val projects = List.of("samlang").cons("...");
    Developer.init(github, company, projects)
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
