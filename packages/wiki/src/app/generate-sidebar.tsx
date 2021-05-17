import { checkNotNull } from 'lib-common';

import type { WikiPrivateDocumentMetadata } from './documents';
import type { SidebarItem } from 'lib-react-docs/components/DocSidebar';

const treeifySingleDocumentMedatada = ({
  documentID,
  filename,
}: WikiPrivateDocumentMetadata): SidebarItem => {
  const filenameSegments = filename.split('/');
  let entry: SidebarItem = {
    type: 'link',
    label: checkNotNull(filenameSegments[filenameSegments.length - 1]),
    href: `/intern#doc-${documentID}`,
  };
  for (let i = filenameSegments.length - 2; i >= 0; i -= 1) {
    entry = {
      type: 'category',
      label: checkNotNull(filenameSegments[i]),
      items: [entry],
    };
  }
  return entry;
};

const mergeTrees = (existingTrees: SidebarItem[], entry: SidebarItem): void => {
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
): readonly SidebarItem[] => {
  const mergedEntries: SidebarItem[] = [];
  documentMetadataList
    .map(treeifySingleDocumentMedatada)
    .forEach((entry) => mergeTrees(mergedEntries, entry));
  return mergedEntries;
};

export default treeifyDocumentMetadata;
