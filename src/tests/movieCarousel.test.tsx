// MovieCarousel.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Movie } from "../constants/context";
import MovieCarousel from "../components/home/MovieCarousel";
import { MyContextProvider } from "../constants/context"; // Import MyContextProvider
import "@testing-library/jest-dom";

// Create test data
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Movie 1",
    year: 2021,
    rating: "PG",
    actors: ["Actor 1"],
    genre: "Action",
    synopsis: "Synopsis of Movie 1",
    thumbnail: "https://example.com/image1.jpg",
    isTrending: true,
  },
  {
    id: "2",
    title: "Movie 2",
    year: 2022,
    rating: "PG-13",
    actors: ["Actor 2"],
    genre: "Drama",
    synopsis: "Synopsis of Movie 2",
    thumbnail: "https://example.com/image2.jpg",
    isTrending: false,
  },
];

describe("MovieCarousel", () => {
  // Set up sessionStorage before each test
  beforeEach(() => {
    sessionStorage.setItem("isLoggedIn", "true"); // Set isLoggedIn to true
  });

  it("renders with the correct title and movies", () => {
    render(
      <MyContextProvider>
        {" "}
        {/* Wrap MovieCarousel with MyContextProvider */}
        <MovieCarousel movies={mockMovies} title="Recommended Movies" />
      </MyContextProvider>,
    );

    // Check that the title renders correctly
    expect(screen.getByText("Recommended Movies")).toBeInTheDocument();

    // Check that the movies render correctly
    mockMovies.forEach((movie) => {
      expect(screen.getByAltText(movie.title)).toBeInTheDocument();
      expect(screen.getByText(movie.title)).toBeInTheDocument();
      expect(screen.getByText(movie.genre)).toBeInTheDocument();
      expect(screen.getByText(movie.year.toString())).toBeInTheDocument();
    });
  });
});
