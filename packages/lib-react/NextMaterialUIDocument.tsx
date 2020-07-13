// Adapted from: https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript

import React, { ReactElement } from 'react';

// eslint-disable-next-line import/no-unresolved
import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
  // eslint-disable-next-line import/no-unresolved
} from 'next/document';

export default class NextMaterialUIDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/jsx-props-no-spreading
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()];
    return { ...initialProps, styles };
  }

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
