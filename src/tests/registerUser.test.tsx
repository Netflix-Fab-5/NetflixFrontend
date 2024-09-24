// src/__tests__/registerUser.test.tsx
import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RegisterScreen from "../screens/RegisterScreen";
import { MyContextProvider } from "../constants/context";
import axios from "axios";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("registerUser", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should register a user successfully", async () => {
    // Mock response for a successful registration
    mockedAxios.post.mockResolvedValue({ data: { name: "mockUserId" } });

    render(
      <MemoryRouter>
        <MyContextProvider>
          <RegisterScreen />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Fill out the registration form
    fireEvent.change(screen.getByLabelText(/Username:/), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password" },
      id: "password",
    });
    fireEvent.change(screen.getByLabelText("Confirm Password:"), {
      target: { value: "password" },
      id: "confirmPassword",
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Wait for the success message to appear
    await waitFor(() =>
      expect(
        screen.getByText("User registered successfully!"),
      ).toBeInTheDocument(),
    );
  });

  it.only("should handle registration failure", async () => {
    // Mock response for a failed registration
    mockedAxios.post.mockRejectedValue(
      new Error(" Okänt fel inträffade vid registrering"),
    );

    render(
      <MemoryRouter>
        <MyContextProvider>
          <RegisterScreen />
        </MyContextProvider>
      </MemoryRouter>,
    );

    // Fill out the registration form
    fireEvent.change(screen.getByLabelText(/Username:/), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password" },
      id: "password",
    });
    fireEvent.change(screen.getByLabelText("Confirm Password:"), {
      target: { value: "password" },
      id: "confirmPassword",
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Wait for the error message to appear
    await waitFor(() =>
      expect(
        screen.getByText("Okänt fel inträffade vid registrering"),
      ).toBeInTheDocument(),
    );
  });
});
