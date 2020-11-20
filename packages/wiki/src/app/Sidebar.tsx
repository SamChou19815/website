import React, { ReactElement } from 'react';

import DocSidebar from '@theme/DocSidebar';

import type { WikiPrivateDocumentMetadata } from './documents';

import { checkNotNull } from 'lib-common';

type Props = {
  readonly className?: string;
  readonly selectedDocumentID: string | null;
  readonly documentMetadataList: readonly WikiPrivateDocumentMetadata[];
};

type SideBarEntry =
  | { readonly type: 'link'; readonly label: string; readonly href: string }
  | {
      readonly type: 'category';
      readonly label: string;
      readonly collapsed: true;
      readonly items: SideBarEntry[];
    };

const treeifySingleDocumentMedatada = ({
  documentID,
  filename,
}: WikiPrivateDocumentMetadata): SideBarEntry => {
  const filenameSegments = filename.split('/');
  let entry: SideBarEntry = {
    type: 'link',
    label: checkNotNull(filenameSegments[filenameSegments.length - 1]),
    href: `/intern#doc-${documentID}`,
  };
  for (let i = filenameSegments.length - 2; i >= 0; i -= 1) {
    entry = {
      type: 'category',
      label: checkNotNull(filenameSegments[i]),
      collapsed: true,
      items: [entry],
    };
  }
  return entry;
};

const mergeTrees = (existingTrees: SideBarEntry[], entry: SideBarEntry): void => {
  if (entry.type === 'link') {
    existingTrees.push(entry);
    return;
  }
  for (let i = 0; i < existingTrees.length; i += 1) {
    const mergeCandidate = checkNotNull(existingTrees[i]);
    if (mergeCandidate.type === 'category' && mergeCandidate.label === entry.label) {
      const firstItem = checkNotNull(entry.items[0]);
      mergeTrees(mergeCandidate.items, firstItem);
      return;
    }
  }
  existingTrees.push(entry);
};

const treeifyDocumentMetadata = (
  documentMetadataList: readonly WikiPrivateDocumentMetadata[]
): readonly SideBarEntry[] => {
  const mergedEntries: SideBarEntry[] = [];
  documentMetadataList
    .map(treeifySingleDocumentMedatada)
    .forEach((entry) => mergeTrees(mergedEntries, entry));
  return mergedEntries;
};

const Sidebar = ({ className, selectedDocumentID, documentMetadataList }: Props): ReactElement => {
  return (
    <div className={className} role="complementary">
      <DocSidebar
        sidebar={treeifyDocumentMetadata(documentMetadataList)}
        path={`/intern${selectedDocumentID == null ? '' : `#doc-${selectedDocumentID}`}`}
        sidebarCollapsible
        isHidden={false}
        onCollapse={() => {}}
      />
    </div>
  );
};

export default Sidebar;
