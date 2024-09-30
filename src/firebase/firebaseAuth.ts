import { auth } from "./firebase";
import {
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";

// Logga ut användaren
export const logoutUser = async () => {
  await signOut(auth);
};

// Kontrollera autentiseringsstatus (kan användas i useEffect i komponenter)
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};
