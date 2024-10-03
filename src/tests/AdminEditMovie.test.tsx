import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MyContext } from "../constants/context";
import AllMoviesScreen from "../screens/AllMoviesScreen";
import { mockContextValue } from "./mocks/dataMocks";
import "@testing-library/jest-dom";

describe("AllMoviesScreen Component", async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Edit buttons for each movie when admin user is logged in", async () => {
    // Render the AllMoviesScreen component with mocked data
    render(
      <MemoryRouter>
        <MyContext.Provider value={mockContextValue}>
          <AllMoviesScreen />
        </MyContext.Provider>
      </MemoryRouter>,
    );

    // Get the edit button
    const editButtons = screen.getAllByTestId("edit-button");

    await waitFor(() => expect(editButtons[0]).toBeInTheDocument());
  });
});
