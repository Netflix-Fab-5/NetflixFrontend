import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCarousel from "../components/home/MovieCarousel";
import { MyContext } from "../constants/context";
import { vi, expect, describe, beforeEach, it } from "vitest";
import { Movie } from "../constants/types";
import "@testing-library/jest-dom";

// Mocka användarnavigationen
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("MovieCarousel Component", () => {
  const mockAddFavorite = vi.fn();
  const mockRemoveFavorite = vi.fn();
  const mockSetError = vi.fn();
  const mockHandleFetchMovies = vi.fn();
  const mockHandleFetchMovieById = vi.fn();
  const mockAddMovie = vi.fn();
  const mockFilterMoviesByGenre = vi.fn();

  const mockMovies: Movie[] = [
    {
      title: "Movie 1",
      year: 2021,
      rating: "PG-13",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 1",
      thumbnail: "thumb1.jpg",
      isTrending: false,
    },
    {
      title: "Movie 2",
      year: 2022,
      rating: "R",
      actors: [],
      genre: "Comedy",
      synopsis: "Synopsis 2",
      thumbnail: "thumb2.jpg",
      isTrending: false,
    },
    {
      title: "Movie 3",
      year: 2023,
      rating: "PG",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 3",
      thumbnail: "thumb3.jpg",
      isTrending: false,
    },
    {
      title: "Movie 4",
      year: 2024,
      rating: "R",
      actors: [],
      genre: "Drama",
      synopsis: "Synopsis 4",
      thumbnail: "thumb4.jpg",
      isTrending: false,
    },
    {
      title: "Movie 5",
      year: 2025,
      rating: "PG-13",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 5",
      thumbnail: "thumb5.jpg",
      isTrending: false,
    },
    {
      title: "Movie 6",
      year: 2026,
      rating: "PG",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 6",
      thumbnail: "thumb6.jpg",
      isTrending: false,
    },
    {
      title: "Movie 7",
      year: 2027,
      rating: "R",
      actors: [],
      genre: "Comedy",
      synopsis: "Synopsis 7",
      thumbnail: "thumb7.jpg",
      isTrending: false,
    },
    {
      title: "Movie 8",
      year: 2028,
      rating: "PG-13",
      actors: [],
      genre: "Drama",
      synopsis: "Synopsis 8",
      thumbnail: "thumb8.jpg",
      isTrending: false,
    },
    {
      title: "Movie 9",
      year: 2029,
      rating: "PG",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 9",
      thumbnail: "thumb9.jpg",
      isTrending: false,
    },
    {
      title: "Movie 10",
      year: 2030,
      rating: "R",
      actors: [],
      genre: "Comedy",
      synopsis: "Synopsis 10",
      thumbnail: "thumb10.jpg",
      isTrending: false,
    },
    {
      title: "Movie 11",
      year: 2031,
      rating: "PG-13",
      actors: [],
      genre: "Action",
      synopsis: "Synopsis 11",
      thumbnail: "thumb11.jpg",
      isTrending: false,
    },

    // Extra film för att testa pagination
  ];

  const mockContextValue = {
    movies: {},
    movie: null,
    filteredMovies: mockMovies,
    genres: ["Action", "Comedy", "Drama"],
    favorites: [],
    loading: false,
    error: null,
    setError: mockSetError,
    success: true,
    user: null,
    handleFetchMovies: mockHandleFetchMovies,
    handleFetchMovieById: mockHandleFetchMovieById,
    addMovie: mockAddMovie,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    filterMoviesByGenre: mockFilterMoviesByGenre,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <MovieCarousel movies={mockMovies} title="Test Carousel" />
      </MyContext.Provider>,
    );
    expect(screen.getByText("Test Carousel")).toBeInTheDocument();
  });

  it("should navigate to previous page when clicking previous button", async () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <MovieCarousel movies={mockMovies} title="Test Carousel" />
      </MyContext.Provider>,
    );

    // Navigera till nästa sida
    const nextButton = screen.getByRole("button", { name: /Next slide/i });
    await userEvent.click(nextButton);

    // Kontrollera att vi nu ser Movie 6
    expect(screen.getByText("Movie 6")).toBeInTheDocument();

    // Klicka på föregående knapp
    const prevButton = screen.getByRole("button", { name: /Previous slide/i });
    await userEvent.click(prevButton);

    // Kontrollera att vi nu ser Movie 1 igen
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
  });
});
