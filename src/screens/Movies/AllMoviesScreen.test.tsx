import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Mock, vi } from "vitest";
import AllMoviesScreen from "./AllMoviesScreen";
import { MyContext } from "../../constants/context";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { User } from "firebase/auth";

// Mock useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock the Firebase
vi.mock("../../firebase/firebaseApi", () => ({
  fetchMovieByTitle: vi.fn(),
}));

// Mocked User data
const mockUser: User = {
  uid: "admin-user",
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: "2024-01-01T00:00:00Z",
    lastSignInTime: "2024-01-01T00:00:00Z",
  },
  providerId: "abc",
  providerData: [],
  tenantId: "mockTenantId",
  displayName: "Admin User",
  email: "admin@mail.com",
  phoneNumber: null,
  photoURL: null,
  refreshToken: "mockRefreshToken",

  // Mocking methods
  delete: vi.fn().mockResolvedValue(undefined),
  getIdToken: vi.fn().mockResolvedValue("mockIdToken"),
  getIdTokenResult: vi.fn().mockResolvedValue({ token: "mockIdTokenResult" }),
  reload: vi.fn().mockResolvedValue(undefined),
  toJSON: vi.fn().mockReturnValue({
    // Mock toJSON method
    uid: "admin-user",
    email: "admin@mail.com",
    displayName: "Admin User",
    emailVerified: true,
    isAnonymous: false,
    providerData: [],
    tenantId: "mockTenantId",
    phoneNumber: null,
    photoURL: null,
  }),
};

describe("AllMoviesScreen", () => {
  // Mocked movie data
  const mockMovies = {
    "1": {
      title: "Simple Movie",
      year: 2020,
      rating: "G",
      actors: ["Actor One"],
      genre: "Comedy",
      synopsis: "A simple movie for testing.",
      thumbnail: "simple-thumbnail-url.jpg",
      isTrending: false,
    },
  };

  // Mocked context
  const mockContextValue = {
    movies: mockMovies,
    movie: null,
    filteredMovies: Object.values(mockMovies),
    genres: [],
    favorites: [],
    loading: false,
    error: null,
    setError: vi.fn(),
    success: true,
    user: mockUser,
    setUser: vi.fn(),
    handleFetchMovies: vi.fn(),
    handleFetchMovieById: vi.fn(),
    handleFetchMovieByTitle: vi.fn(),
    addMovie: vi.fn().mockResolvedValue(true),
    editMovie: vi.fn(),
    deleteMovie: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    filterMoviesByGenre: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders EditButton for admin user", async () => {
    // Mock admin
    (useAuth as Mock).mockReturnValue({
      user: { email: "admin@mail.com" },
      loading: false,
    });

    // Render the component within a context and Router
    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <AllMoviesScreen />
        </Router>
      </MyContext.Provider>,
    );

    // Check if the EditButton is on the screen
    const editButton = screen.getByTestId("edit-button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeVisible();
  });

  it("should click on EditButton ", async () => {
    // Mock admin
    (useAuth as Mock).mockReturnValue({
      user: { email: "admin@mail.com" },
      loading: false,
    });

    // Render the component within a context and Router
    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <AllMoviesScreen />
        </Router>
      </MyContext.Provider>,
    );

    // Check if the EditButton is on the screen
    const editButton = screen.getByTestId("edit-button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeVisible();
  });

  it("does not render EditButton for non-admin user", async () => {
    // Mock a non-admin user
    (useAuth as Mock).mockReturnValue({
      user: { email: "user@mail.com" },
      loading: false,
    });

    // Render the component within a context and Router
    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <AllMoviesScreen />
        </Router>
      </MyContext.Provider>,
    );

    // Ensure that the EditButton is not rendered for non-admin users
    const editButton = screen.queryByTestId("edit-button");
    expect(editButton).not.toBeInTheDocument();
  });
});
