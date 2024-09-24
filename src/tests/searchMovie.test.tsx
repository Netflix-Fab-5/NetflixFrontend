import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchMovie from "../components/navbar/SearchMovie"; // Adjust the path based on your file structure
import { MyContext } from "../constants/context";
import "@testing-library/jest-dom";

// Mock Fuse.js
// Mock Fuse.js to return filtered results
vi.mock("fuse.js", () => {
  return {
    default: class Fuse {
      constructor() {}
      search(query: string) {
        if (query === "Inception") {
          return [{ item: { title: "Inception" } }];
        }
        return [];
      }
    },
  };
});

const mockMovies = {
  movie1: {
    title: "Inception",
    year: 2010,
    rating: "PG-13",
    actors: [],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: true,
  },
  movie2: {
    title: "Interstellar",
    year: 2014,
    rating: "PG-13",
    actors: [],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: false,
  },
  movie3: {
    title: "Dunkirk",
    year: 2017,
    rating: "PG-13",
    actors: [],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: false,
  },
};

// Test context provider for movies
const mockContextValue = {
  movies: mockMovies,
  loading: false,
  error: null,
  isLoggedIn: true,
  success: true,
  registerUser: vi.fn(),
};

describe("SearchMovie", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <MyContext.Provider value={{ ...mockContextValue, loading: true }}>
        <SearchMovie />
      </MyContext.Provider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    render(
      <MyContext.Provider
        value={{ ...mockContextValue, error: "Something went wrong!" }}
      >
        <SearchMovie />
      </MyContext.Provider>,
    );

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("renders list of movies", () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <SearchMovie />
      </MyContext.Provider>,
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Dunkirk")).toBeInTheDocument();
  });

  it("filters movies based on search query", async () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <SearchMovie />
      </MyContext.Provider>,
    );

    // Simulate typing into the search input
    fireEvent.change(
      screen.getByPlaceholderText("Search Movie Name from here"),
      {
        target: { value: "Inception" },
      },
    );

    await waitFor(() => {
      // Expect only "Inception" to be in the results
      expect(screen.getByText("Inception")).toBeInTheDocument();
      expect(screen.queryByText("Interstellar")).not.toBeInTheDocument();
      expect(screen.queryByText("Dunkirk")).not.toBeInTheDocument();
    });
  });
});
