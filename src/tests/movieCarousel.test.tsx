// MovieCarousel.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Movie } from "../constants/context";
import MovieCarousel from "../components/home/MovieCarousel";
import '@testing-library/jest-dom'

// Skapa ett testdata
const mockMovies: Movie[] = [
  {
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
  it("renders with the correct title and movies", () => {
    render(<MovieCarousel movies={mockMovies} title="Recommended Movies" />);

    // Kontrollera att titeln renderas korrekt
    expect(screen.getByText("Recommended Movies")).toBeInTheDocument();

    // Kontrollera att filmerna renderas korrekt
    mockMovies.forEach((movie) => {
      expect(screen.getByAltText(movie.title)).toBeInTheDocument();
      expect(screen.getByText(movie.title)).toBeInTheDocument();
      expect(screen.getByText(movie.genre)).toBeInTheDocument();
      expect(screen.getByText(movie.year.toString())).toBeInTheDocument();
    });
  });
});
