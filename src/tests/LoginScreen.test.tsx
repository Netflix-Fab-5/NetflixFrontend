import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { ContextType } from "../constants/types";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { MyContext, MyContextProvider } from "../constants/context";
import LoginScreen from "../screens/LoginScreen";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import "@testing-library/jest-dom";
import { FirebaseError } from "firebase/app";

// Mocka firebase/auth
vi.mock("firebase/auth", () => {
  const actualAuth =
    vi.importActual<typeof import("firebase/auth")>("firebase/auth");
  return {
    ...actualAuth,
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    signInWithEmailAndPassword: vi.fn(),
    onAuthStateChanged: vi.fn(() => {
      return vi.fn(); // This is the unsubscribe function that will be returned
    }),
  };
});

// Mocka useAuth-hooken
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mocka useNavigate från react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("LoginScreen Component", () => {
  const mockSetUser = vi.fn();
  const mockNavigate = vi.fn();

  let errorState = null; // För att hålla reda på error-tillståndet i testet
  const mockSetError = vi.fn((error) => {
    errorState = error; // Uppdatera error-tillståndet
  });

  // Skapa mockContextValue med alla obligatoriska egenskaper
  const mockContextValue: ContextType = {
    movies: {},
    movie: null,
    genres: [],
    filteredMovies: [],
    favorites: [],
    loading: false,
    error: errorState,
    success: false,
    user: null,
    setUser: mockSetUser,
    setError: mockSetError,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    handleFetchMovies: vi.fn(),
    handleFetchMovieById: vi.fn(),
    handleFetchMovieByTitle: vi.fn(),
    addMovie: vi.fn(),
    deleteMovie: vi.fn(),
    editMovie: vi.fn(),
    filterMoviesByGenre: vi.fn(),
  };

  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false });
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    errorState = null; // Återställ error-tillståndet mellan testerna
    vi.clearAllMocks();
  });

  it("ska logga in framgångsrikt och navigera till startsidan", async () => {
    const email = "admin@mail.com";
    const password = "supersecret";

    // Mocka signInWithEmailAndPassword
    (signInWithEmailAndPassword as Mock).mockResolvedValue({
      user: {
        uid: "test-uid",
        email: "admin@mail.com",
      },
    });

    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <LoginScreen />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/Email/i), email);
    await userEvent.type(screen.getByLabelText(/Password/i), password);

    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "test-uid",
        email: "admin@mail.com",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("ska misslyckas att logga in med ogiltiga uppgifter och visa felmeddelande", async () => {
    const email = "fel@mail.com";
    const password = "felLösenord";
    const errorMessage = "Wrong password";

    (signInWithEmailAndPassword as Mock).mockRejectedValue(
      new FirebaseError("auth/wrong-password", errorMessage),
    );

    render(
      <MemoryRouter>
        <MyContextProvider>
          <LoginScreen />
        </MyContextProvider>
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/Email/i), email);
    await userEvent.type(screen.getByLabelText(/Password/i), password);

    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Kontrollera om felmeddelandet visas på skärmen
    await waitFor(() => {
      expect(screen.getByText(/Wrong password/i)).toBeInTheDocument();
    });
  });
});
