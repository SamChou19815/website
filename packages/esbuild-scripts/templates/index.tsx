import React from 'react';

import Link from 'esbuild-scripts/components/Link';

// Every js/ts file inside this directory will be treated as a page component!

/** The homepage component. It will be inserted into the children part of your _document. */
export default function Homepage(): JSX.Element {
  return (
    <div>
      <h1>I am a homepage.</h1>
      <Link to="/">esbuild-scripts support automatic filesystem-based routing.</Link>
      <img src="/foo.png" alt="You can reference static assets in public folder" />
    </div>
  );
}
