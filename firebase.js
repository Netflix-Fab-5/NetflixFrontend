//Changed from require to import
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

//const db = admin.database();
//changed from module.export to export
export default admin;
