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
        setUser(firebaseUser); // Uppdatera endast state med användaren
      } else {
        setUser(null); // Om ingen är inloggad, sätt användaren till null
        navigate("/login"); // Omdirigera till inloggningssidan
      }
      setLoading(false); // Stoppa laddning när autentiseringsstatus är laddad
    });

    return () => unsubscribe();
  }, [navigate]);

  return { user, loading };
}
