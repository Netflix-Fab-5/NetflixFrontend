// MovieDetails.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MyContextProvider } from "../constants/context";
import MovieDetails from "../screens/MovieDetailScreen";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom"; // Importera jest-dom här

const mockAxios = new MockAdapter(axios);

// Mocka filmdata
const mockMovie = {
  title: "The Godfather",
  synopsis: "Don Vito Corleone, head of a mafia family...",
  year: "1972",
  rating: "R",
  genre: "Crime, Drama",
  actors: ["Marlon Brando", "Al Pacino", "James Caan"],
  thumbnail: "https://example.com/image.jpg",
};

const TestComponent = () => {
  return (
    <Router>
      <MovieDetails />
    </Router>
  );
};

describe("MovieDetails", () => {
  beforeEach(() => {
    mockAxios.reset(); // Återställ mock innan varje test
  });

  it("visar loading state", () => {
    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>,
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("visar filmens detaljer", async () => {
    // Mocka GET-anropet med rätt ID
    mockAxios
      .onGet(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies/1.json",
      )
      .reply(200, mockMovie);

    render(
      <MyContextProvider>
        <TestComponent />
      </MyContextProvider>,
    );

    // Vänta på att filmens detaljer hämtas och visas
    await (() => {
      expect(screen.getByText(/The Godfather/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Don Vito Corleone, head of a mafia family.../i),
      ).toBeInTheDocument();
      expect(screen.getByText(/1972/i)).toBeInTheDocument();
      expect(screen.getByText(/R/i)).toBeInTheDocument();
      expect(screen.getByText(/Crime, Drama/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Marlon Brando, Al Pacino, James Caan/i),
      ).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://example.com/image.jpg",
      );
    });
  });

  it("hanterar fel från API korrekt", async () => {
    // Mocka ett fel vid GET-anrop
    mockAxios
      .onGet(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies/1.json",
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
        screen.getByText(/Något gick fel vid hämtning av data/i),
      ).toBeInTheDocument();
    });
  });
});
