// Adapted from: https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript

import React, { ReactElement } from 'react';

import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

export default class NextMaterialUIDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/jsx-props-no-spreading
        enhanceApp: (App) => (props: Record<string, unknown>) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()];
    return { ...initialProps, styles };
  }

  // eslint-disable-next-line class-methods-use-this
  render(): ReactElement {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: weird
    const head = <Head />;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: weird
    const main = <Main />;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: weird
    const next = <NextScript />;
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: weird
      <Html lang="en">
        {head}
        <body>
          {main}
          {next}
        </body>
      </Html>
    );
  }
}
