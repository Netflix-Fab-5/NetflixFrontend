import { auth } from "./firebase";
import {
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";

// Logga ut användaren
export async function logoutUser() {
  await signOut(auth);
}

// Kontrollera autentiseringsstatus (kan användas i useEffect i komponenter)
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}
