import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getAppUser } from 'lib-firebase/authentication';
import firestore from 'lib-firebase/database';
import { useState, useEffect } from 'react';

import { isAdminUser } from './authentication';

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

const firestorePrivateDocumentMetadataCollection = collection(
  firestore,
  'wiki-app-private-document-metadata'
);

const firestorePrivateDocumentContentCollection = collection(
  firestore,
  'wiki-app-private-document-content'
);

export const useWikiPrivateDocumentsMetadata = ():
  | readonly WikiPrivateDocumentMetadata[]
  | null => {
  const [documents, setDocuments] = useState<readonly WikiPrivateDocumentMetadata[] | null>(null);

  useEffect(() => {
    const currentUserEmail = getAppUser().email;
    const constructedQuery = isAdminUser()
      ? query(firestorePrivateDocumentMetadataCollection)
      : // This check is added for user experience, not for security.
        // The check is also in security rules.
        query(
          firestorePrivateDocumentMetadataCollection,
          where('sharedWith', 'array-contains-any', [currentUserEmail, 'ALL'])
        );
    return onSnapshot(constructedQuery, (snapshot) => {
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
    return onSnapshot(doc(firestorePrivateDocumentContentCollection, documentID), (snapshot) => {
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

  const metadataDocument = await addDoc(firestorePrivateDocumentMetadataCollection, {
    filename,
    sharedWith: [],
  });
  await setDoc(doc(firestorePrivateDocumentContentCollection, metadataDocument.id), {
    title,
    markdownContent: '',
  });
};

export const updateWikiPrivateDocumentMetadata = ({
  documentID,
  ...documentMedatata
}: WikiPrivateDocumentMetadata): void => {
  updateDoc(doc(firestorePrivateDocumentMetadataCollection, documentID), documentMedatata);
};

export const updateWikiPrivateDocumentContent = ({
  documentID,
  ...documentContent
}: WikiPrivateDocumentContent): void => {
  updateDoc(doc(firestorePrivateDocumentContentCollection, documentID), documentContent);
};

export const deleteWikiPrivateDocument = (documentID: string): void => {
  deleteDoc(doc(firestorePrivateDocumentMetadataCollection, documentID));
  deleteDoc(doc(firestorePrivateDocumentContentCollection, documentID));
};
