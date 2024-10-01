import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "../styles/firebase-overrides.css";
import { MyContext } from "../constants/context";

function LoginScreen() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { error } = useContext(MyContext);
  console.log(error);

  useEffect(() => {
    const uiConfig = {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      signInFlow: "popup",
      autoUpgradeAnonymousUsers: true,
      callbacks: {
        signInSuccessWithAuthResult: () => {
          navigate("/"); // Navigera efter lyckad inloggning
          return false;
        },
        signInFailure: (error: firebaseui.auth.AuthUIError) => {
          console.log(error);
          handleSignInError(error);
          return Promise.resolve();
        },
      },
    };

    const initializeFirebaseUI = () => {
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(auth);
      ui.start("#firebaseui-auth-container", uiConfig);
    };

    const handleSignInError = (error: firebaseui.auth.AuthUIError) => {
      console.log(error);
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
      alert(errorMessage);
    };

    initializeFirebaseUI(); // Starta FirebaseUI

    auth.currentUser
      ?.getIdToken(true)
      .then((token) => {
        console.log("Auth Token:", token);
      })
      .catch((error) => {
        console.error("Error fetching auth token:", error);
      });
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-stone-900">
      <div className="firebaseui-container">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-100">
          Login
        </h2>
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
  );
}

export default LoginScreen;
