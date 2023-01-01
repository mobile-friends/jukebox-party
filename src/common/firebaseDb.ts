// Import the functions you need from the SDKs you need
import firebase from '@firebase/app';
import '@firebase/database';
import { FirebaseOptions } from '@firebase/app-types';
import { Env } from '@common/env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseOptions: FirebaseOptions = {
  apiKey: Env.firebaseApiKey(),
  authDomain: 'jukebox-party-3083e.firebaseapp.com',
  projectId: 'jukebox-party-3083e',
  storageBucket: 'jukebox-party-3083e.appspot.com',
  messagingSenderId: Env.firebaseMessagingSenderId(),
  appId: Env.firebaseAppId(),
  measurementId: Env.firebaseMeasurementId(),
  databaseURL: Env.firebaseDatabaseUrl(),
};

const firebaseApp = firebase.apps[0] || firebase.initializeApp(firebaseOptions);
const firebaseDb = firebaseApp.database!(); // TODO: Handle missing database
export default firebaseDb;
