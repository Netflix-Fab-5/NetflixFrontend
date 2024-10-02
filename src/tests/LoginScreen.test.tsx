import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import LoginScreen from "../screens/LoginScreen";
import { MyContext } from "../constants/context";
import { mockContextValue, mockUseAuth } from "./mocks/dataMocks";

// Mocka useNavigate från react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mocka useNavigate
  };
});

// Mocka useAuth hooken för att returnera en användare och loading status
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: null, // Ingen användare inloggad
    loading: false, // Inte i laddningstillstånd
  }),
}));

describe("LoginScreen Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render the login form", () => {
    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, user: null }}>
          <LoginScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    // Kontrollera att inloggningsrutan renderas korrekt
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("should update email input when user types", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MyContext.Provider value={{ ...mockContextValue, user: null }}>
          <LoginScreen />
        </MyContext.Provider>
      </BrowserRouter>,
    );

    const emailInput = screen.getByLabelText("Email");

    // Simulera inmatning i e-postfältet
    await user.type(emailInput, "testuser@mail.com");

    // Kontrollera att e-postfältet uppdateras korrekt
    expect(emailInput).toHaveValue("testuser@mail.com");
  });
});
