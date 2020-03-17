import React, { ReactElement } from 'react';
import * as remarkable from 'remarkable';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore: TypeScript type definition has problems. :(
const markdownRenderer: Remarkable = new remarkable.Remarkable();

export default ({ children }: { readonly children: string }): ReactElement => {
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: markdownRenderer.render(children) }} />;
};
