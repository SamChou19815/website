# esbuild-scripts

A fast, opinioned web development toolkit for building React based websites.

## Features

- Building multi-page applications in React with automatic routing.
- Generating static website with React
- Generating static website without JS

## Getting Started

Installing by

```bash
yarn add esbuild-scripts
```

Then run `yarn esbuild-scripts init`, which will bootstrap your app.

## Commands

### `esbuild-scripts init`

Bootstraps an `esbuild-scripts`-powered React app.

### `esbuild-scripts start`

Starts a devserver at `http://localhost:3000`.

### `esbuild-scripts build`

Bundle a SPA and output the result in `build` folder.

### `esbuild-scripts ssg`

Generate a static site saturated with pre-rendered HTML.

## Guides

### Filesystem-based Routing

Every JS/TS file inside `src/pages` is treated as a routable page. `src/pages/_document` serves as a
general template for all pages.

You can also provide virtual entry points to `esbuild-scripts`. You can use the following hook to
run some generator code before running `esbuild-scripts`:

```js
// hook.js
const mainRunner = require('esbuild-scripts/api').default;

mainRunner(async () => {
  return {
    'index': `import React from 'react';\nexport default () => <div>HomePage</div>`;
    'foo/bar': `import React from 'react';\nexport default () => <div>I'm on foo/bar</div>`;
  }
});
```

Then you can run `node hook.js <esbuild arguments>` to run normal esbuild commands as usual.

### Client/Server only code

If you want to execute some SSR/client-side only code, you can guard your code with `__SERVER__`.

For example,

```typescript
if (__SERVER__) {
  require('fs').unlinkSync('package.json'); // Naughty naughty node.js only code
} else {
  alert('HAHA I AM IN BROWSER!');
}
```

### Disable JS

You can disable JS on specific pages by adding `noJS = true` attribute on your exported React
component. For example,

```typescript
import React from 'react';

const IndexPage = () => <div />;
IndexPage.noJS = true;

export default IndexPage;
```

This is only available in `ssg` mode. In addition, `esbuild-scripts` will not attempt to check
whether excluding the JS will results in broken site.

### CSS

You can import css by using the import syntax:

```typescript
import './index.css';
// Note that SCSS/SASS is also supported.
import './app.scss';
// Unfortunately, css modules are not supported.
// import styles from './App.module.css';
```

### Markdown

You can import markdown files as React components. This is powered by `mdx-js`.

```typescript
import MyDocs from './docs.md';
```

The imported markdown file is required to start with title `# Your title`, and with correct subtitle
nestings. The component you imported will have type `CompiledMarkdownComponent`, which you can see
in [`types.d.ts`](./types.d.ts).

You can postfix the markdown filepath with `?truncated=true`. Then only the markdown content before
the `<!--truncate-->` comment will be preserved.

You can use these primitives provided by `esbuild-scripts` to build static documentation sites or
blogs.

## Components

### `CommonHeader`

A component that lets you configure most of the common `head` elements. Useful for SEO.

### `Head`

Re-exports of `react-helmet`'s `Helmet` component. It allows you to customize your `head` part of
HTML. It works with server-side rendering.

### `HeadTitle`

Let you change the title of the document.

### `Link`

Re-exports of `react-router-dom`'s `Link` component. It allows you to transition to another route.

### `MDXProvider`

Re-exports of `@mdx-js/react`'s `MDXProvider`. It allows you to provide contet for markdown
rendering produced from `mdx`.

### `SSRSuspense`

A wrapper around React's `Suspense`, but works under server-side rendering.

### `router-hooks`

Re-exports `useLocation` and `useHistory` from React Router.

## FAQ

Q: Why is it fast?

A: It's using esbuild under the hood, instead of writing the entire toolchain in JS.

Q: Can you add more customization ability?

A: Currently the project is mainly developed to fit my needs. I will investigate customization
ability when it stablized.
