import React, { ReactElement } from 'react';

import { renderToString } from 'react-dom/server';
import * as remarkable from 'remarkable';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { linkify } from 'remarkable/linkify';

import PrismCodeBlock from './PrismCodeBlock';
import remarkableCheckboxPlugin from './remarkable-checkbox-plugin';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TypeScript type definition has problems. :(
const markdownRenderer: Remarkable = new remarkable.Remarkable({
  typeGrapher: true,
  highlight: (code: string, language: string): string =>
    renderToString(
      <PrismCodeBlock language={language} excludeWrapper>
        {code}
      </PrismCodeBlock>
    ),
});
markdownRenderer.use(linkify).use(remarkableCheckboxPlugin);

type Props = { readonly className?: string; readonly children: string };

export default ({ className, children }: Props): ReactElement => {
  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markdownRenderer.render(children) }}
    />
  );
};
