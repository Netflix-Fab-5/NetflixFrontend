import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterScreen() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Create a new user object
    const newUser = {
      username,
      email,
      password,  // In a real-world app, don't store passwords like this!
    };

    try {
      // Send the user data to Firebase Realtime Database
      const response = await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json", // .json is required for Firebase Realtime Database
        newUser
      );

      console.log(response.data); // This contains the unique Firebase ID for the new user

      setSuccess(true);
      setError(null);


      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/");

    } catch (err) {
      setError("Failed to register user. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>User registered successfully!</p>}
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
