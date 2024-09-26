import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddAMovie from "../components/admin/AddAMovie";
import { MyContextProvider } from "../constants/context"; // Adjust the import based on your context file
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("AddAMovie", () => {
  // Resetting mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully add a new movie", async () => {
    // Mock API response
    mockedAxios.post.mockResolvedValue({
      data: { message: "Movie added successfully" },
    });

    render(
      <MemoryRouter>
        <MyContextProvider>
          <AddAMovie />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Fill out add movie form
    fireEvent.change(screen.getByTestId("title-input"), {
      target: { value: "Inception" },
    });
    fireEvent.change(screen.getByTestId("year-input"), {
      target: { value: 2010 },
    });
    fireEvent.change(screen.getByTestId("rating-input"), {
      target: { value: "PG-13" },
    });
    fireEvent.change(screen.getByTestId("actor-input"), {
      target: { value: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page" },
    });
    fireEvent.change(screen.getByTestId("genre-input"), {
      target: { value: "Action" },
    });
    fireEvent.change(screen.getByTestId("synopsis-input"), {
      target: {
        value:
          "A skilled thief is offered a chance to erase his criminal record by implanting an idea into a target's subconscious.",
      },
    });
    fireEvent.change(screen.getByTestId("thumbnail-input"), {
      target: { value: "https://test.com/inception.jpg" },
    });

    // Click isTrending checkbox
    fireEvent.click(screen.getByTestId("trending-input"));

    // Click submit button
    fireEvent.click(screen.getByRole("button", { name: /Add A New Movie/i }));

    // Wait for the success message to display
    await waitFor(() =>
      expect(screen.getByText("Movie added successfully")).toBeInTheDocument(),
    );
  });

  it("should handle movie failure", async () => {
    // Mock API response for failure
    mockedAxios.post.mockRejectedValue(
      new Error("Failed to add new movie. Please try again."),
    );

    render(
      <MemoryRouter>
        <MyContextProvider>
          <AddAMovie />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Fill out add movie form
    fireEvent.change(screen.getByTestId("title-input"), {
      target: { value: "Inception" },
    });
    fireEvent.change(screen.getByTestId("year-input"), {
      target: { value: 2010 },
    });
    fireEvent.change(screen.getByTestId("rating-input"), {
      target: { value: "PG-13" },
    });
    fireEvent.change(screen.getByTestId("actor-input"), {
      target: { value: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page" },
    });
    fireEvent.change(screen.getByTestId("genre-input"), {
      target: { value: "Action" },
    });
    fireEvent.change(screen.getByTestId("synopsis-input"), {
      target: {
        value:
          "A skilled thief is offered a chance to erase his criminal record by implanting an idea into a target's subconscious.",
      },
    });
    fireEvent.change(screen.getByTestId("thumbnail-input"), {
      target: { value: "https://test.com/inception.jpg" },
    });

    fireEvent.click(screen.getByTestId("trending-input"));

    // Click submit button
    fireEvent.click(screen.getByRole("button", { name: /Add A New Movie/i }));

    // Wait for the error message to display
    await waitFor(() =>
      expect(
        screen.getByText(
          "Misslyckades med att lägga till ny film. Försök igen.",
        ),
      ).toBeInTheDocument(),
    );
  });
});
