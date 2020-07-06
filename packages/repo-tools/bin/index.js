module.exports = (function (e, n) {
  'use strict';
  var t = {};
  function __webpack_require__(n) {
    if (t[n]) {
      return t[n].exports;
    }
    var r = (t[n] = { i: n, l: false, exports: {} });
    var s = true;
    try {
      e[n].call(r.exports, r, r.exports, __webpack_require__);
      s = false;
    } finally {
      if (s) delete t[n];
    }
    r.l = true;
    return r.exports;
  }
  __webpack_require__.ab = __dirname + '/';
  function startup() {
    return __webpack_require__(910);
  }
  return startup();
})({
  129: function (e) {
    e.exports = require('child_process');
  },
  726: function (e, n, t) {
    'use strict';
    Object.defineProperty(n, '__esModule', { value: true });
    const r = t(747);
    const s = t(950);
    const o = (e) =>
      `jobs:\n  ${e}:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - uses: actions/setup-node@v1\n      - uses: actions/cache@v2\n        with:\n          path: |\n            .yarn/cache\n            .pnp.js\n          key: yarn-berry-\${{ hashFiles('**/yarn.lock') }}\n          restore-keys: |\n            yarn-berry-\n      - name: Yarn Install\n        run: yarn install`;
    const c = (e) => {
      const n = [
        ...s.getDependencyChain(e).map((e) => `packages/${e}/**`),
        'package.json',
        'yarn.lock',
        'configuration/**',
        `.github/workflows/generated-*-${e}.yml`,
      ];
      return n.map((e) => `      - ${e}`).join('\n');
    };
    const a = (e) => {
      const n = `generated-ci-${e}.yml`;
      const t = `# @generated\n\nname: CI ${e}\non:\n  push:\n    paths:\n${c(e)}\n\n${o(
        'build'
      )}\n      - name: Compile\n        run: yarn workspace ${e} compile\n`;
      return [n, t];
    };
    const i = (e) => {
      const n = `generated-cd-${e}.yml`;
      const t = `# @generated\n\nname: CD ${e}\non:\n  push:\n    branches:\n      - master\n    paths:\n${c(
        e
      )}\nenv:\n  FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}\n\n${o(
        'deploy'
      )}\n      - name: Build\n        run: yarn workspace ${e} build\n      - name: Deploy\n        run: yarn workspace ${e} deploy\n`;
      return [n, t];
    };
    const u = ([e, n]) => r.writeFileSync(`.github/workflows/${e}`, n);
    const l = () => {
      const e = r.readFileSync('.gitignore');
      const n = '\n# styles\n.yarn\npackages/lib-docusaurus-plugin/index.js\n';
      r.writeFileSync('.eslintignore', `${e}${n}\n# deno\ntools\n`);
      r.writeFileSync('.prettierignore', e + n);
    };
    const p = () => {
      Array.from(r.readdirSync('.github/workflows'))
        .filter((e) => e.includes('generated-'))
        .forEach((e) => r.unlinkSync(`.github/workflows/${e}`));
      s.allPrivateWorkspaces.forEach((e) => {
        u(a(e));
      });
      s.projectWorkspaces.forEach((e) => {
        u(i(e));
      });
      r.writeFileSync(
        'configuration/libraries.json',
        `${JSON.stringify(s.libraryWorkspaces, undefined, 2)}\n`
      );
      l();
    };
    n.default = p;
  },
  747: function (e) {
    e.exports = require('fs');
  },
  910: function (e, n, t) {
    'use strict';
    var r =
      (this && this.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
    Object.defineProperty(n, '__esModule', { value: true });
    const s = r(t(726));
    s.default();
  },
  950: function (e, n, t) {
    'use strict';
    Object.defineProperty(n, '__esModule', { value: true });
    n.validateDependencyChain = n.getDependencyChain = n.projectWorkspaces = n.libraryWorkspaces = n.allPrivateWorkspaces = void 0;
    const r = t(129);
    const s = () => {
      const e = new Map();
      const n = r.spawnSync('yarn', ['workspaces', 'list', '-v', '--json'], { shell: true });
      const t = n.stdout.toString().trim();
      const s = `[${t.split('\n').join(',')}]`;
      const o = JSON.parse(s);
      o.forEach(({ name: n, workspaceDependencies: t }) => {
        if (n == null) {
          return;
        }
        e.set(
          n,
          t.map((e) => {
            if (!e.startsWith('packages/')) {
              throw new Error(`Bad dependency of ${n}: ${e}`);
            }
            return e.substring('packages/'.length);
          })
        );
      });
      return e;
    };
    const o = s();
    const c = Array.from(o.keys()).filter((e) => !e.startsWith('@dev-sam'));
    n.allPrivateWorkspaces = c;
    const a = c.filter((e) => e.startsWith('lib-'));
    n.libraryWorkspaces = a;
    const i = c.filter((e) => !e.startsWith('lib-'));
    n.projectWorkspaces = i;
    const u = (e) => {
      const n = o.get(e);
      if (n == null) {
        throw new Error(`Workspace ${e} is not found!`);
      }
      return n;
    };
    const l = (e) => {
      const n = [];
      const t = [];
      const r = new Set();
      const s = new Set();
      const o = (e) => {
        if (s.has(e)) {
          if (!r.has(e)) {
            return;
          }
          t.push(e);
          const n = t.indexOf(e);
          const s = t.slice(n, t.length).join(' -> ');
          throw new Error(`Cyclic dependency detected: ${s}`);
        }
        const c = u(e);
        s.add(e);
        t.push(e);
        r.add(e);
        c.forEach(o);
        r.delete(e);
        t.pop();
        n.push(e);
      };
      o(e);
      return n;
    };
    n.getDependencyChain = l;
    const p = () =>
      Array.from(o.keys()).forEach((e) => {
        l(e);
        console.log(`No cyclic dependency detected with ${e} as root.`);
      });
    n.validateDependencyChain = p;
  },
});
