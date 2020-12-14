import Document, { Html, Head, Main, NextScript } from 'next/document';
import type { ReactElement } from 'react';

export default class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
