import React, { ReactElement } from 'react';
import highlight from 'highlight.js';
import * as remarkable from 'remarkable';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { linkify } from 'remarkable/linkify';
import registerLanguage from './language';
import './CodeBlock.css';

registerLanguage();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore: TypeScript type definition has problems. :(
const markdownRenderer: Remarkable = new remarkable.Remarkable({
  typeGrapher: true,
  highlight: (code: string, language: string): string => {
    if (language && highlight.getLanguage(language)) {
      try {
        return highlight.highlight(language, code).value;
      } catch {
        // Do nothing.
      }
    }

    try {
      return highlight.highlightAuto(language).value;
    } catch {
      return '';
    }
  }
}).use(linkify);

export default ({ children }: { readonly children: string }): ReactElement => {
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: markdownRenderer.render(children) }} />;
};
