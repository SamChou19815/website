import React, { ReactElement, useState } from 'react';

import { WikiPrivateDocumentMetadata, updateWikiPrivateDocumentMetadata } from './documents';

type Props = { readonly metadata: WikiPrivateDocumentMetadata };

const PrivateDocumentMetadataEditor = ({ metadata }: Props): ReactElement => {
  const [filename, setFilename] = useState(metadata.filename);
  const [sharedWithString, setSharedWithString] = useState(metadata.sharedWith.join(','));

  return (
    <div className="card vertical-margin-1em">
      <div className="card__header">
        <h2>Edit Document Metadata</h2>
      </div>
      <div className="card__body">
        <input
          className="text-input"
          type="text"
          value={filename}
          placeholder="Filename"
          onChange={(event) => setFilename(event.currentTarget.value)}
        />
      </div>
      <div className="card__body">
        <input
          className="text-input"
          type="text"
          value={sharedWithString}
          placeholder="Shared With"
          onChange={(event) => setSharedWithString(event.currentTarget.value)}
        />
      </div>
      <div className="card__footer">
        <button
          className="button button--primary"
          onClick={() => {
            updateWikiPrivateDocumentMetadata({
              documentID: metadata.documentID,
              filename,
              sharedWith:
                sharedWithString.trim() === ''
                  ? []
                  : sharedWithString.split(',').map((it) => it.trim()),
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PrivateDocumentMetadataEditor;
