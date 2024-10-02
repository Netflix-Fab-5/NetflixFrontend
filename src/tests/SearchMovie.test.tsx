import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import SearchMovie from "../components/navbar/SearchMovie";
import { MyContext } from "../constants/context";

// Mocka Fuse.js för att returnera förväntade resultat
vi.mock("fuse.js", () => {
  return {
    default: class Fuse {
      constructor() {}
      search(query: string) {
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

// Mocka useNavigate från react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mocka useNavigate
  };
});

// Mocka context-värden för att simulera en lyckad sökning
const mockContextValue = {
  movies: {},
  loading: false,
  error: null,
  setError: vi.fn(),
  movie: null,
  favorites: [],
  success: false,
  user: null,
  setUser: vi.fn(),
  handleFetchMovies: vi.fn(),
  handleFetchMovieById: vi.fn(),
  handleFetchMovieByTitle: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  deleteMovie: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  filteredMovies: [],
  genres: [],
  filterMoviesByGenre: vi.fn(),
};

describe("SearchMovie Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should show matching movie when a valid query is typed", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: false }}>
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );

    // Simulera att användaren skriver "Inception"
    await user.type(searchInput, "Inception");

    await waitFor(() => {
      // Kontrollera att rätt film visas i resultatlistan
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });
  });

  it("should not show any movie when an invalid query is typed", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: false }}>
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );

    // Simulera att användaren skriver en ogiltig fråga
    await user.type(searchInput, "Unknown Movie");

    await waitFor(() => {
      // Kontrollera att inga filmer visas
      expect(screen.queryByText("Inception")).not.toBeInTheDocument();
      expect(screen.queryByText("Interstellar")).not.toBeInTheDocument();
    });
  });

  it("should navigate to the movie detail page when a result is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: false }}>
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );

    await user.type(searchInput, "Inception");

    await waitFor(() =>
      expect(screen.getByText("Inception")).toBeInTheDocument(),
    );

    // Klicka på resultatet
    const result = screen.getByText("Inception");
    await user.click(result);

    // Kontrollera att användaren navigeras till rätt URL
    expect(mockNavigate).toHaveBeenCalledWith("/movies/inception");
  });

  it("should clear the results when the search query is cleared", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: false }}>
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      "Search Movie Name from here",
    );

    // Skriv "Inception" och vänta tills filmen visas
    await user.type(searchInput, "Inception");
    await waitFor(() =>
      expect(screen.getByText("Inception")).toBeInTheDocument(),
    );

    // Rensa sökfältet
    await user.clear(searchInput);

    // Kontrollera att resultaten har försvunnit
    await waitFor(() => {
      expect(screen.queryByText("Inception")).not.toBeInTheDocument();
      expect(screen.queryByText("Interstellar")).not.toBeInTheDocument();
    });
  });

  it("should show loading message when loading is true", () => {
    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, loading: true }}>
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Kontrollera att laddningsmeddelandet visas
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show error message when error is present", () => {
    render(
      <BrowserRouter>
        <MyContext.Provider
          value={{
            ...mockContextValue,
            loading: false,
            error: "Something went wrong",
          }}
        >
          <SearchMovie />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Kontrollera att felmeddelandet visas
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
