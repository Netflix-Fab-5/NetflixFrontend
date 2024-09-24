import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MyContextProvider, MyContext } from "../constants/Context";
import { useContext } from "react";
import "@testing-library/jest-dom";

// Mocka Axios
const mockAxios = new MockAdapter(axios);

// Testdata
const mockMovies = [
  {
    title: "Movie 1",
    year: 2021,
    rating: "PG-13",
    actors: ["Actor 1", "Actor 2"],
    genre: "Action",
    synopsis: "A great action movie",
    thumbnail: "url/to/thumbnail1",
  },
  {
    title: "Movie 2",
    year: 2020,
    rating: "R",
    actors: ["Actor 3", "Actor 4"],
    genre: "Drama",
    synopsis: "A great drama movie",
    thumbnail: "url/to/thumbnail2",
  },
];

// Testkomponent för att använda context
const TestComponent = () => {
  const context = useContext(MyContext);

  if (!context) {
    return <div>Context is undefined</div>;
  }

  const { movies, loading, error } = context;

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {movies.map((movie, index) => (
        <div key={index}>
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
};

// Test-suite
describe("MyContextProvider", () => {
  it("visar laddningsstatus initialt", () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>,
    );
    expect(screen.getByText("Laddar...")).toBeInTheDocument();
  });

  it("hämtar och renderar filmer från API korrekt", async () => {
    // Mocka GET-anropet
    mockAxios
      .onGet(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
      )
      .reply(200, mockMovies);

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>,
    );

    // Vänta på att filmerna hämtas och visas
    await waitFor(() => {
      expect(screen.getByText("Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Movie 2")).toBeInTheDocument();
    });
  });

  it("hanterar fel från API korrekt", async () => {
    // Mocka ett fel vid GET-anrop
    mockAxios
      .onGet(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
      )
      .reply(500);

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>,
    );

    // Vänta på att felet visas
    await waitFor(() => {
      expect(
        screen.getByText("Error: Något gick fel vid hämtning av data"),
      ).toBeInTheDocument();
    });
  });
});
