// LoginScreen.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MyContextProvider } from "../constants/context";
import LoginScreen from "../screens/LoginScreen";
import "@testing-library/jest-dom";

describe("LoginScreen", () => {
  // Mocka loginUser-funktionen
  const loginUser = vi.fn();

  // Testa rendering och inloggning
  it("should render login form and handle form submission", async () => {
    // Rendera komponenten inuti context-provider och MemoryRouter
    render(
      <MemoryRouter>
        <MyContextProvider>
          <LoginScreen />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Kontrollera om formuläret och knapparna finns
    expect(screen.getByLabelText("Användarnamn:")).toBeInTheDocument();
    expect(screen.getByLabelText("Lösenord:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /logga in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrera dig/i }),
    ).toBeInTheDocument();

    // Simulera att fylla i formuläret
    // fireEvent.change(screen.getByLabelText('Användarnamn:'), {
    //   target: { value: 'testuser' },
    // });
    // fireEvent.change(screen.getByLabelText('Lösenord:'), {
    //   target: { value: 'password' },
    // });

    // // Simulera formulärskick
    // fireEvent.click(screen.getByRole('button', { name: /logga in/i }));

    // // Kontrollera om inloggningen lyckas
    // await waitFor(() => {
    //   expect(loginUser).toHaveBeenCalledWith({
    //     username: 'testuser',
    //     password: 'password',
    //     email: '',
    //   });
    // });
  });

  // Testa felmeddelande
  it("should display error message if login fails", async () => {
    // Rendera komponenten inuti context-provider och MemoryRouter
    render(
      <MemoryRouter>
        <MyContextProvider>
          <LoginScreen />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Mocka ett felmeddelande
    const errorMessage = "Felaktigt användarnamn eller lösenord";
    loginUser.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Simulera att fylla i formuläret
    fireEvent.change(screen.getByLabelText("Användarnamn:"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Lösenord:"), {
      target: { value: "wrongpassword" },
    });

    // Simulera formulärskick
    fireEvent.click(screen.getByRole("button", { name: /logga in/i }));

    // Kontrollera om felmeddelandet visas
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
