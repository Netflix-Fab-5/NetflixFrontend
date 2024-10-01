import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { ref, get, push } from "firebase/database";
import {
  fetchMovies,
  fetchMovieById,
  addMovie,
  fetchGenres,
} from "../firebase/firebaseApi";

// Mocka Firebase-uppstartning
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
  push: vi.fn(),
}));

describe.only("Firebase API Tests", () => {
  const mockGet = get as Mock;
  const mockPush = push as Mock;
  const mockRef = ref as Mock;

  beforeEach(() => {
    // Återställ mockade funktioner innan varje test
    vi.clearAllMocks();
  });

  it("should fetch movies successfully", async () => {
    const moviesData = {
      movie1: {
        title: "Movie 1",
        year: 2021,
        rating: "PG-13",
        actors: ["Actor 1"],
        genre: "Action",
        synopsis: "Synopsis 1",
        thumbnail: "url1",
        isTrending: true,
      },
      movie2: {
        title: "Movie 2",
        year: 2022,
        rating: "R",
        actors: ["Actor 2"],
        genre: "Comedy",
        synopsis: "Synopsis 2",
        thumbnail: "url2",
        isTrending: false,
      },
    };

    // Mocka returnerad data
    mockGet.mockResolvedValueOnce({
      val: () => moviesData,
    });

    const movies = await fetchMovies();
    expect(movies).toEqual(moviesData);
    expect(mockGet).toHaveBeenCalled();
  });

  it("should fetch a movie by ID successfully", async () => {
    const movieData = {
      title: "Movie 1",
      year: 2021,
      rating: "PG-13",
      actors: ["Actor 1"],
      genre: "Action",
      synopsis: "Synopsis 1",
      thumbnail: "url1",
      isTrending: true,
    };
    const movieId = "movie1";

    mockRef.mockReturnValue({ val: vi.fn() }); // Mocka referensen
    mockGet.mockResolvedValueOnce({
      val: () => movieData,
    });

    const movie = await fetchMovieById(movieId);
    expect(movie).toEqual({ ...movieData, id: movieId });
    expect(mockGet).toHaveBeenCalled();
  });

  it("should return null when movie is not found", async () => {
    const movieId = "nonexistentMovie";

    mockRef.mockReturnValue({ val: vi.fn() }); // Mocka referensen
    mockGet.mockResolvedValueOnce({
      val: () => null,
    });

    const movie = await fetchMovieById(movieId);
    expect(movie).toBeNull();
    expect(mockGet).toHaveBeenCalled();
  });

  it("should add a new movie successfully", async () => {
    const newMovie = {
      title: "New Movie",
      year: 2023,
      rating: "PG",
      actors: ["New Actor"],
      genre: "Drama",
      synopsis: "New Synopsis",
      thumbnail: "urlNew",
      isTrending: false,
    };

    mockRef.mockReturnValue({ val: vi.fn() }); // Mocka referensen

    await addMovie(newMovie);
    // expect(mockRef).toHaveBeenCalledWith('movies');
    expect(mockPush).toHaveBeenCalledWith(mockRef(), newMovie);
  });

  it("should fetch genres from movies", async () => {
    const moviesData = {
      movie1: { title: "Movie 1", genre: "Action, Comedy" },
      movie2: { title: "Movie 2", genre: "Drama, Action" },
    };

    mockGet.mockResolvedValueOnce({
      val: () => moviesData,
    });

    const genres = await fetchGenres();
    expect(genres).toEqual(["Action", "Comedy", "Drama"]);
  });

  it("should return empty array when no movies are found", async () => {
    mockGet.mockResolvedValueOnce({
      val: () => null,
    });

    const genres = await fetchGenres();
    expect(genres).toEqual([]);
  });
});
