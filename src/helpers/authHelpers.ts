import { FirebaseError } from "firebase/app";

export function handleSignInError(
  error: FirebaseError,
  setError: (message: string) => void,
) {
  let errorMessage = "An error occurred!";
  if (error.code === "auth/wrong-password") {
    errorMessage = "Wrong password";
  } else if (error.code === "auth/user-not-found") {
    errorMessage = "Email not found";
  } else if (error.code === "auth/invalid-email") {
    errorMessage = "Wrong email address, please try again";
  } else if (error.code === "auth/network-request-failed") {
    errorMessage = "Network error, please try again";
  }
  console.log(errorMessage);
  setError(errorMessage);
}
