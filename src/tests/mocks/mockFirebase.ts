// mockFirebase.ts
import { vi } from "vitest";

export const mockSignInWithEmailAndPassword = vi.fn().mockResolvedValue({
  user: {
    uid: "12345",
    email: "testuser@mail.com",
  },
});

// Mocka Firebase-auth
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn().mockReturnValue({}),
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: "12345", email: "testuser@mail.com" }); // Simulera att användaren är inloggad
    return vi.fn(); // Returnera en mockad unsubscribe-funktion
  }),
}));
