import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Använd om du behöver Realtime Database
import { getAuth } from "firebase/auth"; // Använd om du behöver autentisering

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

// Initiera Firebase
const app = initializeApp(firebaseConfig);

// Om du använder Realtime Database
const database = getDatabase(app);

// Om du använder autentisering
const auth = getAuth(app);

export { app, database, auth }; // Exportera Firebase-tjänster för att kunna använda i hela appen
