import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import GenreFilter from "./GenreFilter"; // Importera genrefilter
import AllMoviesScreen from "../../screens/Movies/AllMoviesScreen"; // Importera din AllMoviesScreen
import { MyContext } from "../../constants/context"; // Mocka din context

// Mock-filmer och kontextvärden
const mockMovies = {
  movie1: {
    id: "1",
    title: "Inception",
    genre: "Action, Sci-Fi",
    year: 2010,
    rating: "PG-13",
    actors: ["Leonardo DiCaprio"],
    synopsis: "A mind-bending thriller",
    thumbnail: "some-thumbnail-url",
    isTrending: false,
  },
  movie2: {
    id: "2",
    title: "The Godfather",
    genre: "Crime, Drama",
    year: 1972,
    rating: "R",
    actors: ["Marlon Brando"],
    synopsis: "A mafia crime story",
    thumbnail: "some-thumbnail-url",
    isTrending: true,
  },
  movie3: {
    id: "3",
    title: "Saving Private Ryan",
    genre: "War, Drama",
    year: 1998,
    rating: "R",
    actors: ["Tom Hanks"],
    synopsis: "A World War II story",
    thumbnail: "some-thumbnail-url",
    isTrending: false,
  },
};

const mockContextValue = {
  movies: mockMovies,
  filteredMovies: Object.values(mockMovies), // Initialt visar vi alla filmer
  genres: ["Action", "Drama", "Sci-Fi", "War"],
  loading: false,
  error: null,
  setError: vi.fn(),
  success: false,
  setSuccess: vi.fn(),
  user: null,
  setUser: vi.fn(),
  movie: null,
  favorites: [],
  handleFetchMovies: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  deleteMovie: vi.fn(),
  handleFetchMovieById: vi.fn(),
  handleFetchMovieByTitle: vi.fn(),
  handleDeleteMovie: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  filterMoviesByGenre: vi.fn(), // Mockar funktionen för filtrering
};

describe("GenreFilter Component", function () {
  beforeEach(function () {
    vi.resetAllMocks(); // Återställ alla mockar innan varje test
  });

  it("should filter movies by genre when a genre is clicked", async function () {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={mockContextValue}>
          <GenreFilter />
          <AllMoviesScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Kontrollera att alla filmer visas initialt
    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(await screen.findByText("The Godfather")).toBeInTheDocument();
    expect(await screen.findByText("Saving Private Ryan")).toBeInTheDocument();

    // Öppna dropdown-menyn
    const dropdownButton = screen.getAllByText("Categories");
    await user.click(dropdownButton[0]);

    // Simulera att användaren klickar på "Drama" i filtret
    const dramaFilter = screen.getByText("Drama");
    await user.click(dramaFilter);

    // Verifiera att filterMoviesByGenre kallas med rätt värden
    expect(mockContextValue.filterMoviesByGenre).toHaveBeenCalledWith([
      "Drama",
    ]);
  });

  it("should show all movies if no genre is selected", async function () {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={mockContextValue}>
          <GenreFilter />
          <AllMoviesScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Se till att alla filmer visas initialt
    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(await screen.findByText("The Godfather")).toBeInTheDocument();
    expect(await screen.findByText("Saving Private Ryan")).toBeInTheDocument();
    // Öppna dropdown-menyn

    const dropdownButton = screen.getAllByText("Categories");
    await user.click(dropdownButton[0]);

    // Klicka på Drama-genren för att filtrera
    const dramaFilter = screen.getByText("Drama");
    await user.click(dramaFilter);

    // Klicka på Drama-genren igen för att ta bort filtret
    await user.click(dramaFilter);

    // Kontrollera att alla filmer visas igen
    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(await screen.findByText("The Godfather")).toBeInTheDocument();
    expect(await screen.findByText("Saving Private Ryan")).toBeInTheDocument();
  });

  it("should filter movies by multiple genres when multiple genres are clicked", async function () {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={mockContextValue}>
          <GenreFilter />
          <AllMoviesScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Öppna dropdown-menyn
    const dropdownButton = screen.getAllByText("Categories");
    await user.click(dropdownButton[0]);

    // Klicka på Drama-genren för att filtrera
    const dramaFilter = screen.getByText("Drama");
    await user.click(dramaFilter);

    // Klicka på Action-genren för att filtrera
    const actionFilter = screen.getByText("Action");
    await user.click(actionFilter);

    // Verifiera att filterMoviesByGenre kallas med rätt värden (både Drama och Action)
    expect(mockContextValue.filterMoviesByGenre).toHaveBeenCalledWith([
      "Drama",
      "Action",
    ]);
  });

  it("should toggle the dropdown menu visibility when clicked", async function () {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={mockContextValue}>
          <GenreFilter />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Se till att dropdown-menyn inte är synlig först
    expect(screen.queryByText("Drama")).not.toBeInTheDocument();

    // Öppna dropdown-menyn
    const dropdownButton = screen.getAllByText("Categories");
    await user.click(dropdownButton[0]);

    // Kontrollera att dropdown-menyn visas
    expect(screen.getByText("Drama")).toBeInTheDocument();

    // Stäng dropdown-menyn genom att klicka igen
    await user.click(dropdownButton[0]);

    // Kontrollera att dropdown-menyn stängs
    expect(screen.queryByText("Drama")).not.toBeInTheDocument();
  });

  it("should show all movies again when a genre is deselected", async function () {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={mockContextValue}>
          <GenreFilter />
          <AllMoviesScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Öppna dropdown-menyn
    const dropdownButton = screen.getAllByText("Categories");
    await user.click(dropdownButton[0]);

    // Klicka på Drama-genren för att filtrera
    const dramaFilter = screen.getByText("Drama");
    await user.click(dramaFilter);

    // Klicka på Drama-genren igen för att ta bort filtret
    await user.click(dramaFilter);

    // Kontrollera att alla filmer visas igen

    // Kontrollera att alla filmer visas igen
    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(await screen.findByText("The Godfather")).toBeInTheDocument();
    expect(await screen.findByText("Saving Private Ryan")).toBeInTheDocument();
  });
});
