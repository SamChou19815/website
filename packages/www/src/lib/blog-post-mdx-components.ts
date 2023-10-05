export default {
  "/blog/2023/10/01/what-happens-if-react-is-eager": () =>
    import("../../blog/2023-10-01-what-happens-if-react-is-eager.mdx"),
  "/blog/2023/09/23/samlang-perf-opt": () => import("../../blog/2023-09-23-samlang-perf-opt.mdx"),
  "/blog/2023/09/11/life-of-high-school-cs-club-member": () =>
    import("../../blog/2023-09-11-life-of-high-school-cs-club-member.mdx"),
  "/blog/2023/01/08/samlang-rust-rewrite": () =>
    import("../../blog/2023-01-08-samlang-rust-rewrite.mdx"),
  "/blog/2022/09/05/bounded-qualification": () =>
    import("../../blog/2022-09-05-bounded-qualification.mdx"),
  "/blog/2022/01/28/why-useless-code": () => import("../../blog/2022-01-28-why-useless-code.mdx"),
  "/blog/2022/01/02/courseplan-review": () => import("../../blog/2022-01-02-courseplan-review.mdx"),
  "/blog/2021/10/29/samlang-wasm-backend": () =>
    import("../../blog/2021-10-29-samlang-wasm-backend.mdx"),
  "/blog/2021/02/16/squash-and-merge": () => import("../../blog/2021-02-16-squash-and-merge.mdx"),
  "/blog/2021/01/24/samlang-llvm-backend": () =>
    import("../../blog/2021-01-24-samlang-llvm-backend.mdx"),
  "/blog/2020/08/30/samlang-ts-rewrite": () =>
    import("../../blog/2020-08-30-samlang-ts-rewrite.mdx"),
  "/blog/2020/05/17/samlang-in-browser": () =>
    import("../../blog/2020-05-17-samlang-in-browser.mdx"),
  "/blog/2020/05/14/one-year-as-dev-lead": () =>
    import("../../blog/2020-05-14-one-year-as-dev-lead.mdx"),
  "/blog/2020/01/09/implement-autocomplete": () =>
    import("../../blog/2020-01-09-implement-autocomplete.mdx"),
  "/blog/2020/01/07/my-decade-in-review": () =>
    import("../../blog/2020-01-07-my-decade-in-review.mdx"),
  "/blog/2019/01/12/samlang-alpha-design-choices": () =>
    import("../../blog/2019-01-12-samlang-alpha-design-choices.mdx"),
  "/blog/2018/12/31/cs-in-high-schools": () =>
    import("../../blog/2018-12-31-cs-in-high-schools.mdx"),
  "/blog/2018/08/27/cw-turing-complete": () =>
    import("../../blog/2018-08-27-cw-turing-complete.mdx"),
  "/blog/2018/06/19/sampl-fun-ref-mistake-fix": () =>
    import("../../blog/2018-06-19-sampl-fun-ref-mistake-fix.mdx"),
  "/blog/2018/06/15/sampl-alpha-design-choices": () =>
    import("../../blog/2018-06-15-sampl-alpha-design-choices.mdx"),
  "/blog/2017/05/31/project-defcon-1": () => import("../../blog/2017-05-31-project-defcon-1.mdx"),
  "/blog/2016/12/30/nerd-pride": () => import("../../blog/2016-12-30-nerd-pride.mdx"),
  "/blog/1970/01/01/welcome-to-my-blog": () =>
    import("../../blog/1970-01-01-welcome-to-my-blog.mdx"),
} as Record<string, () => Promise<typeof import("*.mdx")>>;
