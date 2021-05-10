/* eslint-disable */
// prettier-ignore
var N=Object.create,f=Object.defineProperty,$=Object.getPrototypeOf,O=Object.prototype.hasOwnProperty,F=Object.getOwnPropertyNames,V=Object.getOwnPropertyDescriptor;
var y = (e) => f(e, '__esModule', { value: !0 });
var R = (e, r) => {
    for (var t in r) f(e, t, { get: r[t], enumerable: !0 });
  },
  G = (e, r, t) => {
    if ((r && typeof r == 'object') || typeof r == 'function')
      for (let n of F(r))
        !O.call(e, n) &&
          n !== 'default' &&
          f(e, n, { get: () => r[n], enumerable: !(t = V(r, n)) || t.enumerable });
    return e;
  },
  w = (e) =>
    G(
      y(
        f(
          e != null ? N($(e)) : {},
          'default',
          e && e.__esModule && 'default' in e
            ? { get: () => e.default, enumerable: !0 }
            : { value: e, enumerable: !0 }
        )
      ),
      e
    );
y(exports);
R(exports, { default: () => z });
var d = w(require('path'));
var L = (e, r, t, n) => `// @generated
import React from 'react';
import DocPage from 'lib-react-docs/DocPage';
import Content from 'esbuild-scripts-internal/docs/${t}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${e}\`}
    sidebar={${JSON.stringify(r)}}
    toc={${JSON.stringify(n)}}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`,
  x = L;
function j(e) {
  if (e == null) throw new Error(`Value is asserted to be not null, but it is ${e}.`);
}
var h = (e) => (j(e), e);
var E = ({ level: e, label: r }) => `${'#'.repeat(e)} ${r}`,
  B = (e) => {
    let r = [];
    return (
      e
        .split(
          `
`
        )
        .forEach((t) => {
          let n = t.trim();
          if (!n.startsWith('#')) return;
          let i = 0;
          for (; n[i] === '#'; ) i += 1;
          if (i > 6) throw new Error(`Invalid Header: '${n}'`);
          r.push({ level: i, label: n.substring(i).trim() });
        }),
      r
    );
  },
  k = (e, r) => {
    let t = h(e[r]),
      n = [],
      i = r + 1;
    for (; i < e.length; ) {
      let { element: p, level: a, finishedIndex: s } = k(e, i);
      if (a <= t.level) break;
      if (a > t.level + 1) {
        let l = E({ level: a, label: p.label });
        throw new Error(`Invalid header: ${l}. Expected Level: ${t.level + 1}`);
      }
      (i = s), n.push(p);
    }
    return { element: { label: t.label, children: n }, level: t.level, finishedIndex: i };
  },
  J = (e) => {
    let r = B(e);
    if (r[0] == null) throw new Error('Lacking title.');
    if (r[0].level !== 1) throw new Error(`First heading must be h1, found: ${E(r[0])}`);
    if (r.filter((t) => t.level === 1).length > 1) throw new Error('More than one h1.');
    return k(r, 0).element;
  },
  S = J;
var c = w(require('path')),
  te = (0, c.join)(__dirname, 'templates');
var ne = (0, c.join)('.temp', '__server__.jsx'),
  oe = (0, c.join)('docs'),
  ie = (0, c.join)('src', 'pages'),
  T = (0, c.join)('src', 'generated-pages'),
  ae = (0, c.join)('build', '__ssr.jsx'),
  se = (0, c.join)('build', '__ssr.jsx.LEGAL.txt'),
  le = (0, c.join)('build', '__ssr.css');
var o = w(require('fs')),
  m = w(require('path')),
  u = (e, r) => (t) => t ? r(t) : e(),
  g = (e) => new Promise((r, t) => (0, o.readdir)(e, (n, i) => (n ? t(n) : r(i)))),
  _ = async (e) =>
    Promise.all(
      (await g(e)).flatMap(async (r) => {
        let t = (0, m.join)(e, r);
        return (await v(t)) ? [t, ...(await _(t))] : [t];
      })
    ).then((r) => r.flat());
var D = async (e) => {
    let r = await g(e);
    await Promise.all(r.map((t) => W((0, m.join)(e, t))));
  },
  P = (e) => new Promise((r, t) => (0, o.mkdir)(e, { recursive: !0 }, u(r, t))),
  q = (e) => new Promise((r) => (0, o.access)(e, void 0, (t) => r(t == null))),
  v = (e) => new Promise((r, t) => (0, o.lstat)(e, (n, i) => (n ? t(n) : r(i.isDirectory())))),
  C = async (e, r) =>
    r
      ? (await q(e))
        ? (await _(e)).map((t) => (0, m.relative)(e, t)).sort((t, n) => t.localeCompare(n))
        : []
      : g(e),
  A = (e) => new Promise((r, t) => (0, o.readFile)(e, (n, i) => (n ? t(n) : r(i.toString())))),
  W = (e) =>
    new Promise((r, t) => {
      o.readFile != null
        ? (0, o.rm)(e, { recursive: !0, force: !0 }, u(r, t))
        : v(e)
            .then((n) =>
              n ? (0, o.rmdir)(e, { recursive: !0 }, u(r, t)) : (0, o.unlink)(e, u(r, t))
            )
            .catch((n) => t(n));
    }),
  M = (e, r) => new Promise((t, n) => (0, o.writeFile)(e, r, u(t, n)));
var H = (e) => e.substring(0, e.lastIndexOf('.')),
  b = (0, d.join)(T, 'docs'),
  U = async ({ siteTitle: e, sideBarItems: r }) => {
    let t = (await C('docs', !0)).filter((a) => {
      switch ((0, d.extname)(a)) {
        case '.md':
        case '.mdx':
          return !0;
        default:
          return !1;
      }
    });
    await P(b), await D(b);
    let n = await Promise.all(
        t.map(async (a) => {
          let s = await A((0, d.join)('docs', a));
          return { documentPath: a, content: s, tocItem: S(s) };
        })
      ),
      i = (a) =>
        Array.isArray(a)
          ? a.map((s) => {
              let l = n.find(({ documentPath: I }) => `/${H(I)}` === s);
              if (l == null) throw new Error(`No document with href ${s} found on disk.`);
              return { type: 'link', href: `/docs${s}`, label: l.tocItem.label };
            })
          : Object.entries(a).map(([s, l]) => ({ type: 'category', label: s, items: i(l) })),
      p = i(r);
    await Promise.all(
      n.map(async ({ documentPath: a, tocItem: s }) => {
        let l = (0, d.join)(b, `${H(a)}.jsx`);
        await P((0, d.dirname)(l)), await M(l, x(e, p, a, s.children));
      })
    );
  },
  Y = (e) => {
    U(e).then(() => {
      require('esbuild-scripts');
    });
  },
  z = Y;
0 && (module.exports = {});
