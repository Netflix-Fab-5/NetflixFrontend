import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MyContext } from "../constants/context";
import LoginScreen from "../screens/LoginScreen";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";

// Mocka firebase/auth
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
  signInWithEmailAndPassword: vi.fn(),
}));

// Mocka useAuth-hooken
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Partiell mockning av react-router-dom för att behålla MemoryRouter
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocka navigate-funktionen
const mockNavigate = vi.fn();

describe("LoginScreen Component", () => {
  const mockSetUser = vi.fn();
  const mockSetError = vi.fn();

  beforeEach(() => {
    (useAuth as vi.Mock).mockReturnValue({ user: null, loading: false });
    vi.clearAllMocks(); // Rensa tidigare anrop
  });

  it("ska logga in framgångsrikt och navigera till startsidan", async () => {
    const email = "admin@mail.com";
    const password = "supersecret";

    // Ställ in returvärde för signInWithEmailAndPassword
    (signInWithEmailAndPassword as vi.Mock).mockResolvedValue({
      user: {
        uid: "test-uid",
        email: "admin@mail.com",
      },
    });

    // MockContext value för att hantera TypeScript-fel
    const mockContextValue = {
      movies: [],
      movie: null,
      genres: [],
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
      filteredMovies: [],
      favorites: [],
      loading: false,
      error: null,
      success: true,
      user: null, // User är null vid inloggning
      setUser: mockSetUser,
      setError: mockSetError,
      handleFetchMovies: vi.fn(),
      handleFetchMovieById: vi.fn(),
      handleFetchMovieByTitle: vi.fn(),
      addMovie: vi.fn(),
      deleteMovie: vi.fn(),
      editMovie: vi.fn(),
      filterMoviesByGenre: vi.fn(),
    };

    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <LoginScreen />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Fyll i e-post och lösenord
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: email },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: password },
    });

    // Skicka in formuläret
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Vänta på att navigeringen sker
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        uid: "test-uid",
        email: "admin@mail.com",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
