import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieDetails from "../screens/MovieDetailScreen";
import { MyContext } from "../constants/context";
import "@testing-library/jest-dom";

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w-]+/g, "");
};

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
  addMovie: vi.fn(), // Mocka funktionen för att lägga till film
  editMovie: vi.fn(), // Mocka funktionen för att redigera film
  deleteMovie: vi.fn(), // Mocka funktionen för att ta bort film
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  filterMoviesByGenre: vi.fn(),
  success: false,
};

describe("MovieDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it.only("should render movie details correctly", async () => {
  //   const movieSlug = createSlug(mockMovies["1"].title); // Använd den nya sluggen
  //   render(
  //     <MemoryRouter initialEntries={[`/movies/${movieSlug}`]}>
  //       <MyContext.Provider value={mockContextValue}>
  //         <MovieDetails />
  //       </MyContext.Provider>
  //     </MemoryRouter>,
  //   );

  //     expect(await screen.findByText("No movie found")).toBeInTheDocument();
  //     expect(screen.getByText("1966")).toBeInTheDocument();
  //     expect(
  //       screen.getByText(
  //         /A bounty hunting scam joins two men in an uneasy alliance/i,
  //       ),
  //     ).toBeInTheDocument();
  //     expect(screen.getByText(/Western/i)).toBeInTheDocument();
  //     expect(
  //       screen.getByText(/Clint Eastwood, Lee Van Cleef, Eli Wallach/i),
  //     ).toBeInTheDocument();
  //   });
  // });

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
