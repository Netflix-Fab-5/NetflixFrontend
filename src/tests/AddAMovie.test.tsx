import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddAMovie from "../components/admin/AddAMovie";
import "@testing-library/jest-dom";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("AddAMovie", () => {
  // Reseting mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully add a movie", async () => {
    // Mock API response
    mockedAxios.post.mockResolvedValue({
      data: { message: "Movie added successfully" },
    });

    // Render AddAMovie component
    render(<AddAMovie />);

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

    // Click submit button
    fireEvent.click(screen.getByRole("button", { name: /Add A New Movie/i }));

    // Wait for the success message to display
    await waitFor(() =>
      expect(screen.getByText("Movie added successfully")).toBeInTheDocument(),
    );
  });
});
