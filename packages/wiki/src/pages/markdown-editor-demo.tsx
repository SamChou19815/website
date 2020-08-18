import React from 'react';

import Layout from '@theme/Layout';

import MarkdownEditorWithPreview from '../app/MarkdownEditorWithPreview';

export default function MarkdownEditorDemo(): JSX.Element {
  return (
    <Layout title="Markdown Editor Demo" description="Developer Sam's Wiki">
      <MarkdownEditorWithPreview />
    </Layout>
  );
}
