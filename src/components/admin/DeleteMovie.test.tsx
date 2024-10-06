import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MyContext } from "../../constants/context";
import EditAMovie from "./EditAMovie";
import AllMoviesScreen from "../../screens/Movies/AllMoviesScreen";
import { User } from "firebase/auth";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mocked movie data
const mockMovie = {
  "1": {
    id: "1",
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

const mockContextValue = {
  movies: mockMovie,
  movie: mockMovie["1"],
  filteredMovies: Object.values(mockMovie),
  genres: [],
  favorites: [],
  loading: false,
  error: null,
  setError: vi.fn(),
  success: true,
  user: mockUser,
  setUser: vi.fn(),
  handleFetchMovies: vi.fn(),
  handleFetchMovieById: vi.fn().mockResolvedValue(mockMovie["1"]),
  handleFetchMovieByTitle: vi.fn(),
  editMovie: vi.fn().mockResolvedValue(true),
  addMovie: vi.fn(),
  deleteMovie: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  filterMoviesByGenre: vi.fn(),
};

describe("EditAMovie Component", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render delete movie button", async function () {
    mockContextValue.handleFetchMovieById = vi
      .fn()
      .mockResolvedValue(mockMovie["1"]);

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <MyContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/edit/:movieId" element={<EditAMovie />} />
          </Routes>
        </MyContext.Provider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Delete")).toBeInTheDocument();
  });

  it("should delete the movie", async function () {
    mockContextValue.handleFetchMovieById = vi
      .fn()
      .mockResolvedValue(mockMovie["1"]);

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <MyContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/edit/:movieId" element={<EditAMovie />} />
            <Route path="/movies" element={<AllMoviesScreen />} />
          </Routes>
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Wait for the "Delete" Text to appear
    expect(await screen.findByText("Delete")).toBeInTheDocument();

    // Get the delete button
    const deleteButton = screen.getByRole("button", {
      name: /Delete/i,
    });
    // Click on delete button
    await userEvent.click(deleteButton);
  });
});
