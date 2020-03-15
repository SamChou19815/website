/** Import this module to initialize everything for firebase. */

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyATVAg7tqVu-wOEflgRJwpRK0gFBSAX-UY',
  authDomain: 'developer-sam.firebaseapp.com',
  databaseURL: 'https://developer-sam.firebaseio.com',
  projectId: 'developer-sam',
  storageBucket: 'developer-sam.appspot.com',
  messagingSenderId: '624504906871',
  appId: '1:624504906871:web:aea649f2678609054e5272',
  measurementId: 'G-ZK0G552JZC'
});
