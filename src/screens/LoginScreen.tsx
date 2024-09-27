import { useState } from "react";
import { loginUser } from "../firebase/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Återställ eventuella felmeddelanden

    try {
      await loginUser({ email, password }); // Logga in användaren med Firebase Auth
      navigate("/"); // Omdirigera till HomeScreen efter lyckad inloggning
    } catch (err: unknown) {
      console.log(err);
      setError("Inloggningen misslyckades. Kontrollera dina uppgifter.");
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <h2>Logga in</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default LoginScreen;
