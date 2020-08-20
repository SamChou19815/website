import React from 'react';

import Layout from '@theme/Layout';

import MarkdownEditorWithPreview from '../app/MarkdownEditorWithPreview';

// eslint-disable-next-line no-alert
const onSubmit = () => alert("This dummy submit button does nothing.");

export default function MarkdownEditorDemo(): JSX.Element {
  return (
    <Layout title="Markdown Editor Demo" description="Developer Sam's Wiki">
      <MarkdownEditorWithPreview initialMarkdownCode="" onSubmit={onSubmit} />
    </Layout>
  );
}
