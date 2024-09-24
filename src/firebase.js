// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Om du använder Realtime Database

// Din Firebase-konfiguration (med Web SDK-nycklar)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initiera Firebase-appen med Web SDK
const app = initializeApp(firebaseConfig);

// Exportera appen och andra Firebase-tjänster
export default app;
