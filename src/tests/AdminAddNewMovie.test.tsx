import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MyContext } from "../constants/context";
import AddMovie from "../components/admin/AddAMovie";
import { User } from "firebase/auth";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mocked movie data
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

describe("AddMovie Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Add a new movie button ", async () => {
    // Render the Add new Movie component with the mocked context
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <AddMovie />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Get the Add new movie button
    const submitButton = screen.getByRole("button", {
      name: /Add A New Movie/i,
    });

    expect(submitButton).toBeInTheDocument(); // Checking the button is in the admin screen
  });

  it("should add a new movie successfully", async () => {
    const user = userEvent.setup();
    // Render the Add new Movie component with the mocked context
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <AddMovie />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Find the form inputs
    const titleInput = screen.getByTestId("title-input");
    const yearInput = screen.getByTestId("year-input");
    const genreInput = screen.getByTestId("genre-input");
    const ratingInput = screen.getByTestId("rating-input");
    const synopsisInput = screen.getByTestId("synopsis-input");
    const actorsInput = screen.getByTestId("actor-input");
    const thumbnailInput = screen.getByTestId("thumbnail-input");
    const isTrending = screen.getByTestId("trending-input");

    // Get the button
    const submitButton = screen.getByRole("button", {
      name: /Add A New Movie/i,
    });

    // Fill the form
    await user.type(titleInput, "New Movie Title");
    await user.type(yearInput, "2024");
    await user.type(genreInput, "Comedy");
    await user.type(ratingInput, "G");
    await user.type(synopsisInput, "A new movie synopsis.");
    await user.type(thumbnailInput, "urlhere.");
    await user.type(actorsInput, "Actor One, Actor Two");
    await user.click(isTrending);

    // Click on Add a new movie button
    await user.click(submitButton);

    // wait to display the success msg
    await waitFor(() =>
      expect(screen.getByText("Movie added successfully")).toBeInTheDocument(),
    );
  });

  it("should show an error message when adding a movie fails", async () => {
    const user = userEvent.setup();

    // Update the success to false and errro as desired
    const mockContextWithErrorValue = {
      ...mockContextValue,
      success: false,
      error: "Failed to add new movie. Please try again.",
      addMovie: vi
        .fn()
        .mockRejectedValue(
          new Error("Failed to add new movie. Please try again."),
        ),
    };

    // Render the AddMovie component with the mocked context
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextWithErrorValue}>
          <AddMovie />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Find the form inputs
    const titleInput = screen.getByTestId("title-input");
    const yearInput = screen.getByTestId("year-input");
    const genreInput = screen.getByTestId("genre-input");
    const ratingInput = screen.getByTestId("rating-input");
    const synopsisInput = screen.getByTestId("synopsis-input");
    const actorsInput = screen.getByTestId("actor-input");
    const thumbnailInput = screen.getByTestId("thumbnail-input");
    const isTrending = screen.getByTestId("trending-input");

    const submitButton = screen.getByRole("button", {
      name: /Add A New Movie/i,
    }); // get the button

    // Fill the form
    await user.type(titleInput, "New Movie Title");
    await user.type(yearInput, "2024");
    await user.type(genreInput, "Comedy");
    await user.type(ratingInput, "G");
    await user.type(synopsisInput, "A new movie synopsis.");
    await user.type(thumbnailInput, "urlhere.");
    await user.type(actorsInput, "Actor One, Actor Two");
    await user.click(isTrending);

    // Click on Add a new movie button
    await user.click(submitButton);

    // Wait for the error message to displayed
    await waitFor(() => {
      const errorMessage = screen.getByText(
        "Failed to add new movie. Please try again.",
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
