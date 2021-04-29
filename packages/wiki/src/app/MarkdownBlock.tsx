import React, { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Remarkable } from 'remarkable';

import PrismCodeBlock from 'lib-react/PrismCodeBlock';

const markdownRenderer: Remarkable = new Remarkable({
  typographer: true,
  highlight: (code: string, language: string): string => {
    return renderToString(
      <PrismCodeBlock language={language} excludeWrapper>
        {code.trim()}
      </PrismCodeBlock>
    );
  },
});

type Props = { readonly className?: string; readonly markdownCode: string };

const MarkdownBlock = ({ className, markdownCode }: Props): ReactElement => {
  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markdownRenderer.render(markdownCode) }}
    />
  );
};

export default MarkdownBlock;
