import { useState, useEffect } from 'react';

import { firestore } from 'firebase/app';

import { getAppUser, isAdminUser } from './authentication';

export type WikiPrivateDocumentMetadata = {
  readonly documentID: string;
  readonly filename: string;
  readonly sharedWith: readonly string[];
};

export type WikiPrivateDocumentContent = {
  readonly documentID: string;
  readonly title: string;
  readonly markdownContent: string;
};

type FirebaseType<T> = Omit<T, 'documentID'>;

const Firestore = firestore();

const firestorePrivateDocumentMetadataCollection = Firestore.collection(
  'wiki-app-private-document-metadata'
);

const firestorePrivateDocumentContentCollection = Firestore.collection(
  'wiki-app-private-document-content'
);

export const useWikiPrivateDocumentsMetadata = ():
  | readonly WikiPrivateDocumentMetadata[]
  | null => {
  const [documents, setDocuments] = useState<readonly WikiPrivateDocumentMetadata[] | null>(null);

  useEffect(() => {
    const currentUserEmail = getAppUser().email;
    const query = isAdminUser()
      ? firestorePrivateDocumentMetadataCollection
      : // This check is added for user experience, not for security.
        // The check is also in security rules.
        firestorePrivateDocumentMetadataCollection.where('sharedWith', 'array-contains-any', [
          currentUserEmail,
          'ALL',
        ]);
    return query.onSnapshot((snapshot) => {
      const updatedDocuments = snapshot.docs.map((document) => {
        const documentWithoutId = document.data() as FirebaseType<WikiPrivateDocumentMetadata>;
        return { ...documentWithoutId, documentID: document.id };
      });
      setDocuments(updatedDocuments.sort((a, b) => a.filename.localeCompare(b.filename)));
    });
  }, []);

  return documents;
};

export const useWikiPrivateDocumentContent = (
  documentID: string
): WikiPrivateDocumentContent | null => {
  const [content, setContent] = useState<WikiPrivateDocumentContent | null>(null);

  useEffect(() => {
    return firestorePrivateDocumentContentCollection.doc(documentID).onSnapshot((snapshot) => {
      const data = snapshot.data() as FirebaseType<WikiPrivateDocumentContent> | undefined;
      if (data == null) {
        setContent(null);
      } else {
        setContent({ ...data, documentID });
      }
    });
  }, [documentID]);

  return content;
};

export const createWikiPrivateDocument = async (): Promise<void> => {
  // eslint-disable-next-line no-alert
  const filename = prompt('Filename');
  // eslint-disable-next-line no-alert
  const title = prompt('Title');
  if (filename == null || title == null) return;

  const metadataDocument = await firestorePrivateDocumentMetadataCollection.add({
    filename,
    sharedWith: [],
  });
  await firestorePrivateDocumentContentCollection
    .doc(metadataDocument.id)
    .set({ title, markdownContent: '' });
};

export const updateWikiPrivateDocumentMetadata = ({
  documentID,
  ...documentMedatata
}: WikiPrivateDocumentMetadata): void => {
  firestorePrivateDocumentMetadataCollection.doc(documentID).update(documentMedatata);
};

export const updateWikiPrivateDocumentContent = ({
  documentID,
  ...documentContent
}: WikiPrivateDocumentContent): void => {
  firestorePrivateDocumentContentCollection.doc(documentID).update(documentContent);
};

export const deleteWikiPrivateDocument = (documentID: string): void => {
  firestorePrivateDocumentMetadataCollection.doc(documentID).delete();
  firestorePrivateDocumentContentCollection.doc(documentID).delete();
};
