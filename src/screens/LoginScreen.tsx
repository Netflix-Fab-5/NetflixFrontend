import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthError as FirebaseAuthError,
} from "firebase/auth";
import { MyContext } from "../constants/context";
import LoginForm from "../components/LoginForm"; // Importera din formkomponent

function LoginScreen() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser, error, setError } = useContext(MyContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInError = (error: FirebaseAuthError) => {
    let errorMessage = "Ett fel uppstod.";
    if (error.code === "auth/wrong-password") {
      errorMessage = "Fel lösenord.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "Vi kunde inte hitta e-postadressen.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Fel e-postadress.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Nätverksfel, vänligen försök igen.";
    }
    setError(errorMessage);
  };

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
      // Type guard to ensure the error is a Firebase AuthError
      if (typeof error === "object" && error !== null && "code" in error) {
        handleSignInError(error as FirebaseAuthError);
      } else {
        setError("Ett oväntat fel inträffade.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-stone-900">
      <div className="w-full max-w-xs">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-100">
          Logga in
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
