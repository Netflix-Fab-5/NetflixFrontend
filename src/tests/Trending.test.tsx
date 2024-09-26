import { render, screen, fireEvent } from "@testing-library/react";
import { MyContext } from "../constants/context.tsx";
import Trending from "../components/home/Trending.tsx";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

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
  favorites: [],
  loading: false,
  error: null,
  isLoggedIn: true,
  removeFavorite: vi.fn(), // Mock removeFavorite function
  login: vi.fn(), // Mock login function
  logout: vi.fn(), // Mock logout function

  movie: null,

  success: true,
  registerUser: vi.fn(),
  addMovie: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  fetchMovieById: vi.fn(),
};

describe("Trending Component", () => {
  it.only("renders trending movies and calls addFavorite when bookmarking", () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <Trending />
      </MyContext.Provider>,
    );

    // Check if trending movies are displayed
    expect(screen.getByText("The Godfather: Part II")).toBeInTheDocument();

    // Simulate clicking the bookmark button for Movie 1
    const bookmarkButton = screen.getByText("Favorite"); // Adjust selector if necessary
    fireEvent.click(bookmarkButton);

    // Check if addFavorite was called
    expect(mockContextValue.addFavorite).toHaveBeenCalledWith(
      mockMovies.movie1,
    );
  });
});
