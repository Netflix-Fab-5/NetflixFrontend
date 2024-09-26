// firebaseAuth.ts
import { auth } from "./firebase"; // Importera auth från firebase.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";

// Logga in användare med Firebase Authentication
export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password,
    );
    const loggedInUser = userCredential.user;

    const userId = loggedInUser?.uid;
    return { userId, userData: loggedInUser };
  } catch (error: unknown) {
    const typedError = error as Error;
    throw new Error(typedError.message || "Failed to login user.");
  }
};

// Logga ut användaren
export const logoutUser = async () => {
  await signOut(auth);
};

// Kontrollera autentiseringsstatus (kan användas i useEffect i komponenter)
export const onAuthStateChanged = (
  callback: (user: User | null) => void, // Använd User-typen från firebase/auth direkt
) => {
  return firebaseOnAuthStateChanged(auth, callback);
};
