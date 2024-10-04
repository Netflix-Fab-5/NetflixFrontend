import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import HomeScreen from "../../screens/Home/HomeScreen";
import { MyContext } from "../../constants/context";
import { mockContextValue } from "../../tests/mocks/dataMocks";
import { logoutUser } from "../../firebase/firebaseAuth";

// Mocka useAuth-hooken för att simulera en inloggad användare
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: { email: "user@mail.com" }, // Mockad användare som är inloggad
    loading: false,
  })),
}));

// Mocka `logoutUser`-funktionen
vi.mock("../../firebase/firebaseAuth", () => ({
  logoutUser: vi.fn(), // Mockar funktionen
}));

// Mocka specifika delar av `react-router-dom`, men behåll originalet för `BrowserRouter`
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("NavBar Logout Button", () => {
  it("renders Logout button when user is logged in", () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <HomeScreen />
        </Router>
      </MyContext.Provider>,
    );

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls logoutUser when Logout button is clicked", async () => {
    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <HomeScreen />
        </Router>
      </MyContext.Provider>,
    );

    const logoutButton = screen.getByRole("button", { name: /Logout/i });

    await userEvent.click(logoutButton);

    expect(logoutUser).toHaveBeenCalledTimes(1);
  });

  it("redirects user to login page after logout", async () => {
    const mockNavigate = vi.fn(); // Mocka navigate-funktionen
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );

    render(
      <MyContext.Provider value={mockContextValue}>
        <Router>
          <HomeScreen />
        </Router>
      </MyContext.Provider>,
    );

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    await userEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows loading state when loading is true", () => {
    const loadingContextValue = {
      ...mockContextValue,
      loading: true,
    };

    render(
      <MyContext.Provider value={loadingContextValue}>
        <Router>
          <HomeScreen />
        </Router>
      </MyContext.Provider>,
    );

    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
  });

  it("shows error message when error occurs", () => {
    const errorContextValue = {
      ...mockContextValue,
      error: "Failed to fetch movies",
    };

    render(
      <MyContext.Provider value={errorContextValue}>
        <Router>
          <HomeScreen />
        </Router>
      </MyContext.Provider>,
    );

    expect(
      screen.getByText("Error loading movies: Failed to fetch movies"),
    ).toBeInTheDocument();
  });
});
