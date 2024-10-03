import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieDetails from "./MovieDetailScreen";
import { MyContext } from "../../constants/context";
import "@testing-library/jest-dom";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w-]+/g, "");
}

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

const mockContextValue = {
  movies: mockMovies,
  filteredMovies: Object.values(mockMovies),
  genres: ["Comedy"],
  favorites: [],
  loading: false,
  error: null,
  movie: null,
  setError: vi.fn(),
  user: null,
  setUser: vi.fn(),
  handleFetchMovies: vi.fn(),
  handleFetchMovieById: vi.fn(),
  handleFetchMovieByTitle: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  deleteMovie: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  filterMoviesByGenre: vi.fn(),
  success: false,
};

describe("MovieDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render movie details correctly", async () => {
    const movieSlug = createSlug(mockMovies["1"].title);

    render(
      <MemoryRouter initialEntries={[`/movies/${movieSlug}`]}>
        <MyContext.Provider value={mockContextValue}>
          <Routes>
            <Route path="/movies/:title" element={<MovieDetails />} />
          </Routes>
        </MyContext.Provider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Simple Movie")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("A simple movie for testing.")).toBeInTheDocument();
    expect(screen.getByText("Comedy")).toBeInTheDocument();
    expect(screen.getByText("Actor One")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(
      <MemoryRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: true }}>
          <MovieDetails />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should show error message when there is an error", async () => {
    render(
      <MemoryRouter>
        <MyContext.Provider
          value={{ ...mockContextValue, error: "An error occurred" }}
        >
          <MovieDetails />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
  });

  it("should show no movie found message if the movie doesn't exist", async () => {
    render(
      <MemoryRouter initialEntries={["/movies/non-existing-movie"]}>
        <MyContext.Provider
          value={{ ...mockContextValue, movie: null, loading: false }}
        >
          <MovieDetails />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/No movie found/i)).toBeInTheDocument();
  });
});
