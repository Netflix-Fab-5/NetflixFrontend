import { useState, ReactNode } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MyContext } from "../../constants/context";
import AddMovie from "./AddAMovie";
import { User } from "firebase/auth";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mockad filmdatabas
const mockMovies = {
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

// Mockad användardata
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

  // Mockade metoder
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

// Mockad Context Provider
function MockContextProvider({ children }: { children: ReactNode }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockContextValue = {
    movies: mockMovies,
    movie: null,
    filteredMovies: Object.values(mockMovies),
    genres: [],
    favorites: [],
    loading: false,
    error,
    setError,
    success,
    setSuccess,
    user: mockUser,
    setUser: vi.fn(),
    handleFetchMovies: vi.fn(),
    handleFetchMovieById: vi.fn(),
    handleFetchMovieByTitle: vi.fn(),
    addMovie: vi.fn().mockImplementation(async () => {
      try {
        setSuccess(true); // Uppdatera success om filmen läggs till framgångsrikt
        setError(null); // Rensa eventuella tidigare fel
        return Promise.resolve();
      } catch (err) {
        setError("Failed to add new movie. Please try again."); // Hantera fel
        setSuccess(false); // Sätt success till false om ett fel uppstår
        return Promise.reject(
          new Error("Failed to add new movie. Please try again."),
        );
      }
    }),
    editMovie: vi.fn(),
    deleteMovie: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    filterMoviesByGenre: vi.fn(),
  };

  return (
    <MyContext.Provider value={mockContextValue}>{children}</MyContext.Provider>
  );
}

// Mockad Context Provider med fel
function MockContextProviderWithError({ children }: { children: ReactNode }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockContextValue = {
    movies: mockMovies,
    movie: null,
    filteredMovies: Object.values(mockMovies),
    genres: [],
    favorites: [],
    loading: false,
    error,
    setError,
    success,
    setSuccess,
    user: mockUser,
    setUser: vi.fn(),
    handleFetchMovies: vi.fn(),
    handleFetchMovieById: vi.fn(),
    handleFetchMovieByTitle: vi.fn(),
    addMovie: vi.fn().mockImplementation(async () => {
      setError("Failed to add new movie. Please try again."); // Hantera fel
      setSuccess(false); // Sätt success till false när ett fel uppstår
      return Promise.reject(
        new Error("Failed to add new movie. Please try again."),
      );
    }),
    editMovie: vi.fn(),
    deleteMovie: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    filterMoviesByGenre: vi.fn(),
  };

  return (
    <MyContext.Provider value={mockContextValue}>{children}</MyContext.Provider>
  );
}

describe("AddMovie Component", function () {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ska rendera knappen 'Add A New Movie'", async function () {
    // Rendera komponenten med den mockade contexten
    render(
      <MemoryRouter>
        <MockContextProvider>
          <AddMovie />
        </MockContextProvider>
      </MemoryRouter>,
    );

    // Hitta knappen
    const submitButton = screen.getByRole("button", {
      name: /Add A New Movie/i,
    });

    expect(submitButton).toBeInTheDocument();
  });

  it("ska lägga till en ny film framgångsrikt", async function () {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MockContextProvider>
          <AddMovie />
        </MockContextProvider>
      </MemoryRouter>,
    );

    // Hitta formulärfälten
    const titleInput = screen.getByTestId("title-input");
    const yearInput = screen.getByTestId("year-input");
    const genreInput = screen.getByTestId("genre-input");
    const ratingInput = screen.getByTestId("rating-input");
    const synopsisInput = screen.getByTestId("synopsis-input");
    const actorsInput = screen.getByTestId("actor-input");
    const thumbnailInput = screen.getByTestId("thumbnail-input");
    const isTrending = screen.getByTestId("trending-input");

    // Fyll i formuläret
    await user.type(titleInput, "New Movie Title");
    await user.type(yearInput, "2024");
    await user.type(genreInput, "Comedy");
    await user.type(ratingInput, "G");
    await user.type(synopsisInput, "A new movie synopsis.");
    await user.type(thumbnailInput, "urlhere.");
    await user.type(actorsInput, "Actor One, Actor Two");
    await user.click(isTrending);

    // Klicka på knappen för att lägga till filmen
    await user.click(screen.getByRole("button", { name: /Add A New Movie/i }));

    // Vänta på att bekräftelsemeddelandet ska visas
    expect(
      await screen.findByText("Movie added successfully"),
    ).toBeInTheDocument();
  });

  it("ska visa ett felmeddelande när tillägg av film misslyckas", async function () {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MockContextProviderWithError>
          <AddMovie />
        </MockContextProviderWithError>
      </MemoryRouter>,
    );

    // Hitta formulärfälten
    const titleInput = screen.getByTestId("title-input");
    const yearInput = screen.getByTestId("year-input");
    const genreInput = screen.getByTestId("genre-input");
    const ratingInput = screen.getByTestId("rating-input");
    const synopsisInput = screen.getByTestId("synopsis-input");
    const actorsInput = screen.getByTestId("actor-input");
    const thumbnailInput = screen.getByTestId("thumbnail-input");
    const isTrending = screen.getByTestId("trending-input");

    // Fyll i formuläret
    await user.type(titleInput, "New Movie Title");
    await user.type(yearInput, "2024");
    await user.type(genreInput, "Comedy");
    await user.type(ratingInput, "G");
    await user.type(synopsisInput, "A new movie synopsis.");
    await user.type(thumbnailInput, "urlhere.");
    await user.type(actorsInput, "Actor One, Actor Two");
    await user.click(isTrending);

    // Klicka på knappen för att lägga till filmen
    await user.click(screen.getByRole("button", { name: /Add A New Movie/i }));

    // Vänta på att felmeddelandet ska visas
    expect(
      await screen.findByText("Failed to add new movie. Please try again."),
    ).toBeInTheDocument();
  });
});
