import { useState, useEffect } from 'react';

import { firestore } from 'firebase/app';

import { getAppUser, isAdminUser } from './authentication';

export type WikiPrivateDocument = {
  readonly documentID: string;
  readonly sharedWith: readonly string[];
  readonly title: string;
  readonly markdownContent: string;
};

const Firestore = firestore();
const firestorePrivateDocumentCollection = Firestore.collection('wiki-app-private-documents');

export const useWikiPrivateDocuments = (): readonly WikiPrivateDocument[] | null => {
  const [documents, setDocuments] = useState<readonly WikiPrivateDocument[] | null>(null);

  useEffect(() => {
    const currentUserEmail = getAppUser().email;
    const query = isAdminUser()
      ? firestorePrivateDocumentCollection
      : // This check is added for user experience, not for security.
        // The check is also in security rules.
        firestorePrivateDocumentCollection.where('sharedWith', 'array-contains', currentUserEmail);
    return query.onSnapshot((snapshot) => {
      const updatedDocuments = snapshot.docs.map((document) => {
        const documentWithoutId = document.data() as Omit<WikiPrivateDocument, 'documentID'>;
        return { ...documentWithoutId, documentID: document.id };
      });
      setDocuments(updatedDocuments);
    });
  }, []);

  return documents;
};

export const upsertWikiPrivateDocument = ({
  documentID,
  ...documentData
}: WikiPrivateDocument): void => {
  firestorePrivateDocumentCollection.doc(documentID).set(documentData);
};

export const deleteWikiPrivateDocument = (documentID: string): void => {
  firestorePrivateDocumentCollection.doc(documentID).delete();
};
