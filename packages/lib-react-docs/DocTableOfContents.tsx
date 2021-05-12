import React from 'react';

import type { MarkdownTablesOfContentsElement } from 'lib-markdown-header-parser';

import './DocTableOfContents.css';

const generateMarkdownHeaderID = (label: string) => label.toLowerCase().split(/\s+/).join('-');

type HeadingsProps = {
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  readonly hasLink: boolean;
  readonly isChild?: boolean;
};

const Headings = ({ toc, hasLink, isChild }: HeadingsProps) => {
  if (!toc.length) return null;
  return (
    <ul className={isChild ? '' : 'table-of-contents table-of-contents__left-border'}>
      {toc
        .map((element) => ({ ...element, id: generateMarkdownHeaderID(element.label) }))
        .map((element) => (
          <li key={element.label}>
            <a href={hasLink ? `#${element.id}` : undefined} className="table-of-contents__link">
              {element.label}
            </a>
            <Headings isChild hasLink={hasLink} toc={element.children} />
          </li>
        ))}
    </ul>
  );
};

type Props = {
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  readonly hasLink?: boolean;
};

const DocTableOfContents = ({ toc, hasLink = true }: Props): JSX.Element => (
  <div className="lib-react-docs-table-of-contents thin-scrollbar">
    <Headings toc={toc} hasLink={hasLink} />
  </div>
);

export default DocTableOfContents;
