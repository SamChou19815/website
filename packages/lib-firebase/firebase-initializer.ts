/* eslint-disable import/first */

import { FirebaseApp, initializeApp } from 'firebase/app';

const firebaseApp: FirebaseApp = initializeApp({
  apiKey: 'AIzaSyATVAg7tqVu-wOEflgRJwpRK0gFBSAX-UY',
  authDomain: 'developer-sam.firebaseapp.com',
  databaseURL: 'https://developer-sam.firebaseio.com',
  projectId: 'developer-sam',
  storageBucket: 'developer-sam.appspot.com',
  messagingSenderId: '624504906871',
  appId: '1:624504906871:web:aea649f2678609054e5272',
  measurementId: 'G-ZK0G552JZC',
});

export default firebaseApp;
