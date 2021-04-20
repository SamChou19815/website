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

### `esbuild-scripts ssg [--no-js]`

Generate a static site saturated with pre-rendered HTML.

If `--no-js` flag is passed, then no JavaScript will be attached to the HTML.

## Guides

### Filesystem-based Routing

Every JS/TS file inside `src/pages` is treated as a routable page. `src/pages/_document` serves as a
general template for all pages.

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

### CSS

You can import css by using the import syntax:

```typescript
import './index.css';
// Note that SCSS/SASS is also supported.
import './app.scss';
// Unfortunately, css modules are not supported.
// import styles from './App.module.css';
```

## Components

### `Head`

Ex-exports of `react-helmet`'s `Helmet` component. It allows you to customize your `head` part of
HTML. It works with server-side rendering.

### `Link`

Ex-exports of `react-router-dom`'s `Link` component. It allows you to transition to another route.

### `SSRSuspense`

A wrapper around React's `Suspense`, but works under server-side rendering.

## FAQ

Q: Why is it fast?

A: It's using esbuild under the hood, instead of writing the entire toolchain in JS.

Q: Can you add more customization ability?

A: Currently the project is mainly developed to fit my needs. I will investigate customization
ability when it stablized.
