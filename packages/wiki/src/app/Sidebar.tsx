import React, { ReactElement } from 'react';

import DocSidebar from '@theme/DocSidebar';

import { WikiPrivateDocumentMetadata } from './documents';

type Props = {
  readonly className?: string;
  readonly selectedDocumentID: string | null;
  readonly documentMetadataList: readonly WikiPrivateDocumentMetadata[];
};

const Sidebar = ({ className, selectedDocumentID, documentMetadataList }: Props): ReactElement => {
  return (
    <div className={className} role="complementary">
      <DocSidebar
        sidebar={[
          {
            label: 'Documents Shared with You',
            type: 'category',
            collapsed: false,
            items: documentMetadataList.map(({ documentID: id, filename }) => ({
              type: 'link',
              label: filename,
              href: `/intern#doc-${id}`,
            })),
          },
        ]}
        path={`/intern${selectedDocumentID == null ? '' : `#doc-${selectedDocumentID}`}`}
        sidebarCollapsible
      />
    </div>
  );
};

export default Sidebar;
