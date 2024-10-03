import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthError as FirebaseAuthError,
} from "firebase/auth";
import { MyContext } from "../constants/context";
import LoginForm from "../components/LoginForm"; // Importera din formkomponent
import { useAuth } from "../hooks/useAuth";
import { handleSignInError } from "../helpers/authHelpers";

function LoginScreen() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser, error, setError } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setUser(userCredential.user);
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        handleSignInError(error as FirebaseAuthError, setError);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Om användaren redan är inloggad, navigera direkt
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-xs">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-100">
          LOG IN
        </h2>
        <LoginForm
          email={email}
          password={password}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          error={error}
        />
      </div>
    </div>
  );
}

export default LoginScreen;
