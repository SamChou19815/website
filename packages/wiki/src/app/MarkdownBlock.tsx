import React, { ReactElement } from 'react';

import { renderToString } from 'react-dom/server';
import * as remarkable from 'remarkable';

import PrismCodeBlock from 'lib-react/PrismCodeBlock';

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

type Props = { readonly className?: string; readonly markdownCode: string; };

const MarkdownBlock = ({ className, markdownCode, }: Props): ReactElement => {
  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markdownRenderer.render(markdownCode) }}
    />
  );
}

export default MarkdownBlock;
