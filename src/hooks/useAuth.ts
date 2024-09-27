import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase"; // Importera Firebase-konfigurationen
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Sätt användaren om någon är inloggad
      } else {
        setUser(null); // Om ingen är inloggad, sätt användaren till null
        sessionStorage.clear(); // Rensa sessionStorage om användaren loggas ut
      }
      setLoading(false); // Stoppa laddning när autentiseringsstatus är laddad
    });

    // Avsluta lyssnaren när komponenten avmonteras
    return () => unsubscribe();
  }, [navigate]);

  return { user, loading };
}
