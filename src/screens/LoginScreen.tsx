import { useState, useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";

function LoginScreen() {
  const { handleLoginUser, error } = useContext(MyContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Funktion för att hantera inloggningsförsöket
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("test 1, rad13");
    const userCredentials = {
      email, // Använd email och password för inloggning
      password,
    };
    console.log("test 2");

    handleLoginUser(userCredentials); // Anropar funktionen från context
    console.log("test 3");
  };

  return (
    <div>
      <h2>Logga in</h2>
      {error && <p>{error}</p>}

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
      <Link to="/register">
        <button>Registrera dig</button>
      </Link>
    </div>
  );
}

export default LoginScreen;
