import { FirebaseError } from "firebase/app";

export const mockFirebaseAuthErrorWrongPassword: FirebaseError = {
  code: "auth/wrong-password",
  message: "Wrong password",
  name: "FirebaseError",
};

export const mockFirebaseAuthErrorUserNotFound: FirebaseError = {
  code: "auth/user-not-found",
  message: "Email not found",
  name: "FirebaseError",
};

export const mockFirebaseAuthErrorInvalidEmail: FirebaseError = {
  code: "auth/invalid-email",
  message: "Invalid email",
  name: "FirebaseError",
};

export const mockFirebaseAuthErrorNetworkFailed: FirebaseError = {
  code: "auth/network-request-failed",
  message: "Network request failed",
  name: "FirebaseError",
};
