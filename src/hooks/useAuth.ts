import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase"; // Importera Firebase-konfigurationen

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Uppdatera endast state med användaren

      setLoading(false); // Stoppa laddning när autentiseringsstatus är laddad
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
