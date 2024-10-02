import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom"; // Om NavBar använder react-router-dom
import NavBar from "../components/navbar/NavBar";
import { MyContext } from "../constants/context";

// Mocka useAuth för att returnera en användare (vi ignorerar inloggningslogik här)
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: null }), // Mocka att användaren inte är inloggad
}));

describe("Searchbar render", () => {
  it("should render the search bar", () => {
    // Rendera NavBar-komponenten
    render(
      <BrowserRouter>
        <MyContext.Provider
          value={{
            movies: {},
            loading: false,
            error: null,
            setError: vi.fn(),
            movie: null,
            favorites: [],
            success: false,
            user: null,
            setUser: vi.fn(),
            filteredMovies: [],
            genres: [],
            filterMoviesByGenre: vi.fn(),
            handleFetchMovies: vi.fn(),
            handleFetchMovieById: vi.fn(),
            handleFetchMovieByTitle: vi.fn(),
            addMovie: vi.fn(),
            editMovie: vi.fn(),
            addFavorite: vi.fn(),
            removeFavorite: vi.fn(),
          }}
        >
          <NavBar />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Kontrollera att sökfältet finns genom att leta efter placeholder-texten
    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );
    expect(searchInput).toBeInTheDocument();
  });
});
