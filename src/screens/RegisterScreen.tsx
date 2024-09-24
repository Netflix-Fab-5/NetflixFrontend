import { useState, useContext, useEffect } from "react";
import { MyContext } from "../constants/context";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const { registerUser, error, success, isLoggedIn } = useContext(MyContext)!;
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate(); // Används för navigation

  // Om användaren är inloggad, navigera till /
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Navigerar till startsidan
    }
  }, [isLoggedIn, navigate]); // Beroenden: isLoggedIn och navigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enkel validering
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Skapa ett nytt användarobjekt
    const newUser = {
      username,
      email,
      password,
    };

    // Registrera användaren via Context
    registerUser(newUser);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>User registered successfully!</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterScreen;
