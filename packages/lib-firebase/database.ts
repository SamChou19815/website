import { Firestore, getFirestore } from 'firebase/firestore';

import firebaseApp from './firebase-initializer';

const firestore: Firestore = getFirestore(firebaseApp);

export default firestore;
