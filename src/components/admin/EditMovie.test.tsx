import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MyContext } from "../../constants/context";
import EditAMovie from "./EditAMovie";
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
  setSuccess: vi.fn(),
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
  beforeEach(function () {
    vi.clearAllMocks();
  });

  it("should render the edit movie form", async function () {
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

    // Wait for the "Edit the Movie" heading to appear
    expect(await screen.findByText("Edit the Movie")).toBeInTheDocument();
  });

  it("should update a movie", async function () {
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

    expect(await screen.findByText("Edit the Movie")).toBeInTheDocument();

    // Find all the form inputs
    const titleInput = screen
      .getByText(/title/i)
      .closest("div")!
      .querySelector("input")!;
    const yearInput = screen
      .getByText(/year/i)
      .closest("div")!
      .querySelector("input")!;
    const ratingInput = screen
      .getByText(/rating/i)
      .closest("div")!
      .querySelector("input")!;
    const actorsInput = screen
      .getByText(/actors/i)
      .closest("div")!
      .querySelector("input")!;
    const genreInput = screen
      .getByText(/genre/i)
      .closest("div")!
      .querySelector("input")!;
    const synopsisInput = screen
      .getByText(/synopsis/i)
      .closest("div")!
      .querySelector("textarea")!;
    const thumbnailInput = screen
      .getByText(/thumbnail url/i)
      .closest("div")!
      .querySelector("input")!;

    // Check the movie data is in the form
    expect(titleInput).toHaveValue(mockMovie["1"].title);
    expect(yearInput).toHaveValue(mockMovie["1"].year);
    expect(ratingInput).toHaveValue(mockMovie["1"].rating);
    expect(actorsInput).toHaveValue(mockMovie["1"].actors.join(", "));
    expect(genreInput).toHaveValue(mockMovie["1"].genre);
    expect(synopsisInput).toHaveValue(mockMovie["1"].synopsis);
    expect(thumbnailInput).toHaveValue(mockMovie["1"].thumbnail);

    await userEvent.clear(titleInput); // Clear the existing value
    await userEvent.type(titleInput, "Updated Movie"); //add new value
    expect(titleInput).toHaveValue("Updated Movie"); //check new value

    // Get the edit button
    const editMovieButton = screen.getByRole("button", {
      name: /Update Movie/i,
    });
    // Click on edit button
    await userEvent.click(editMovieButton);

    // wait to display the success msg
    expect(
      await screen.findByText("Movie updated successfully"),
    ).toBeInTheDocument();
  });
});
