import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchMovie from "../components/navbar/SearchMovie";
import { MyContext } from "../constants/context";
import { BrowserRouter } from "react-router-dom";

// Mocka Fuse.js för att returnera förväntade resultat
vi.mock("fuse.js", () => {
  return {
    default: class Fuse {
      constructor() {}
      search(query) {
        if (query === "Inception") {
          return [
            {
              item: {
                title: "Inception",
                id: "1",
                year: 2010,
                rating: "PG-13",
                thumbnail: "https://via.placeholder.com/150",
              },
            },
          ];
        }
        return [];
      }
    },
  };
});

// Mockade filmer
const mockMovies = {
  movie1: {
    id: "1",
    title: "Inception",
    year: 2010,
    rating: "PG-13",
    thumbnail: "https://via.placeholder.com/150",
  },
  movie2: {
    id: "2",
    title: "Interstellar",
    year: 2014,
    rating: "PG-13",
    thumbnail: "https://via.placeholder.com/150",
  },
};

describe("SearchMovie Component", () => {
  it("should show matching movie when a valid query is typed", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider
          value={{
            movies: {},
            loading: false,
            error: null,
            movie: null,
            favorites: [],
            success: false,
            user: null,
            handleFetchMovies: vi.fn(),
            handleFetchMovieById: vi.fn(),
            addMovie: vi.fn(),
            addFavorite: vi.fn(),
            removeFavorite: vi.fn(),
          }}
        >
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Hitta sökfältet
    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );

    // Simulera att användaren skriver "Inception"
    await user.type(searchInput, "Inception");

    // Vänta tills sökresultaten renderas
    await waitFor(() => {
      // Kontrollera att rätt film visas i resultatlistan
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });
  });
});
