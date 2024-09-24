import { useState, useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";

function LoginScreen() {
  const { loginUser, error } = useContext(MyContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Funktion för att hantera inloggningsförsöket
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      username,
      password,
      email: "", // Om email inte behövs för inloggning, kan detta vara tomt
    };

    loginUser(user);
  };

  return (
    <div>
      <h2>Logga in</h2>
      {error && <p>{error}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Användarnamn:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
      <Link to="/register">
        <button>Registrera dig</button>
      </Link>
    </div>
  );
}

export default LoginScreen;
