// Import the functions you need from the SDKs you need
import firebase from '@firebase/app';
import '@firebase/database';
import { FirebaseOptions } from '@firebase/app-types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseOptions: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'jukebox-party-3083e.firebaseapp.com',
  projectId: 'jukebox-party-3083e',
  storageBucket: 'jukebox-party-3083e.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const firebaseApp = firebase.apps[0] || firebase.initializeApp(firebaseOptions);
const firebaseDb = firebaseApp.database!(); // TODO: Handle missing database
export default firebaseDb;
