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

describe("NavBar Component", () => {
  it("should render the search bar", () => {
    // Rendera NavBar-komponenten
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
