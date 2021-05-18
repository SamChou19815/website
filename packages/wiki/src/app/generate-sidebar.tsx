import type { WikiPrivateDocumentMetadata } from './documents';
import type { SidebarItem } from 'lib-react-docs/components/DocSidebar';

const treeifySingleDocumentMedatada = ({
  documentID,
  filename,
}: WikiPrivateDocumentMetadata): SidebarItem => {
  const filenameSegments = filename.split('/');
  const lastEntryLabel = filenameSegments[filenameSegments.length - 1];
  if (lastEntryLabel == null) throw new Error();
  let entry: SidebarItem = {
    type: 'link',
    label: lastEntryLabel,
    href: `/intern#doc-${documentID}`,
  };
  for (let i = filenameSegments.length - 2; i >= 0; i -= 1) {
    const label = filenameSegments[i];
    if (label == null) throw new Error();
    entry = { type: 'category', label, items: [entry] };
  }
  return entry;
};

const mergeTrees = (existingTrees: SidebarItem[], entry: SidebarItem): void => {
  if (entry.type === 'link') {
    existingTrees.push(entry);
    return;
  }
  for (let i = 0; i < existingTrees.length; i += 1) {
    const mergeCandidate = existingTrees[i];
    if (mergeCandidate == null) throw new Error();
    if (mergeCandidate.type === 'category' && mergeCandidate.label === entry.label) {
      const firstItem = entry.items[0];
      if (firstItem == null) throw new Error();
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
