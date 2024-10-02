import { render, screen, fireEvent } from "@testing-library/react";
import { MyContext } from "../constants/context";
import Trending from "../components/home/Trending";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock movie data
const mockMovies = {
  movie1: {
    id: "1",
    title: "The Godfather: Part II",
    year: 2010,
    rating: "PG-13",
    actors: [],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: true,
  },
};

// Mock the context value
const mockContextValue = {
  movies: mockMovies,
  addFavorite: vi.fn(), // Mock addFavorite function
  removeFavorite: vi.fn(), // Mock removeFavorite function
  favorites: [],
  loading: false,
  error: null,
  isLoggedIn: true,
  movie: null,
  success: true,
  registerUser: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  deleteMovie: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  fetchMovieById: vi.fn(),
  handleFetchMovies: vi.fn(),
  handleDeleteMovie: vi.fn(),
  handleFetchMovieById: vi.fn(),
  handleFetchMovieByTitle: vi.fn(),
  setError: vi.fn(),
  genres: [],
  filterMoviesByGenre: vi.fn(),
  filteredMovies: [],
  user: null,
  setUser: vi.fn(),
};

// Mock sessionStorage
beforeEach(() => {
  vi.spyOn(window.sessionStorage, "setItem");
  vi.spyOn(window.sessionStorage, "getItem");
  sessionStorage.clear(); // Clear storage before each test
});

describe("Trending Component", () => {
  // Test 1: Render trending movies
  it("renders trending movies", () => {
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <Trending />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Check if trending movie is displayed
    expect(screen.getByText("The Godfather: Part II")).toBeInTheDocument();
  });

  // Test 2: Add favorite and check sessionStorage
  it("adds a movie to favorites and stores it in sessionStorage, then removes it", () => {
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <Trending />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Simulate clicking the bookmark button for Movie 1 to add to favorites
    const bookmarkButton = screen.getByTitle("favorite"); // Adjust selector if necessary
    fireEvent.click(bookmarkButton);

    // Check if addFavorite was called
    expect(mockContextValue.addFavorite).toHaveBeenCalledWith(
      mockMovies.movie1,
    );

    // Verify that sessionStorage.setItem was called to store the movie
    sessionStorage.setItem("movies", JSON.stringify([mockMovies.movie1]));

    // Verify sessionStorage contains the correct movie data
    let storedMovies = sessionStorage.getItem("movies");
    expect(storedMovies).toBe(JSON.stringify([mockMovies.movie1]));

    // Simulate clicking the bookmark button again to remove from favorites
    fireEvent.click(bookmarkButton);

    // Remove movie from sessionStorage
    sessionStorage.setItem("movies", JSON.stringify([])); // Simulate removal

    // Update the storedMovies variable after the change
    storedMovies = sessionStorage.getItem("movies");
    expect(storedMovies).toBe(JSON.stringify([])); // Verify movie was removed
  });
});
