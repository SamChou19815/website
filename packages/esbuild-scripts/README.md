# esbuild-scripts

A fast, opinioned web development toolkit for building React based websites.

## Features

- Building single-page applications in React
- Generating static website with React
- Generating static website without JS

## Getting Started

Installing by

```bash
yarn add esbuild-scripts
```

Then add `types.d.ts` with the following content to a folder that is included in your
`tsconfig.json`:

```typescript
/// <reference types="esbuild-scripts" />
```

After that, add your entrypoint React component in `src/App.tsx`:

```typescript
import React from 'react';

export default function App() {
  return <div>I am the entry point!</div>;
}
```

Finally, create a `public` folder and add in your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React App</title>
  </head>
  <body>
    <!-- The following line is absolutely needed! -->
    <div id="root"></div>
  </body>
</html>
```

## Commands

### `esbuild-scripts start`

Starts a devserver at http://localhost:3000.

### `esbuild-scripts build`

Bundle a SPA and output the result in `build` folder.

### `esbuild-scripts ssg [--no-js]`

Generate a static site saturated with pre-rendered HTML.

If `--no-js` flag is passed, then no JavaScript will be attached to the HTML.

## Guides

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

## FAQ

Q: Why is it fast?

A: It's using esbuild under the hood, instead of writing the entire toolchain in JS.

Q: Can you add more customization ability?

A: Currently the project is mainly developed to fit my needs. I will investigate customization
ability when it stablized.
