import { FirebaseFirestore, getFirestore } from 'firebase/firestore';

import firebaseApp from './firebase-initializer';

const firestore: FirebaseFirestore = getFirestore(firebaseApp);

export default firestore;
