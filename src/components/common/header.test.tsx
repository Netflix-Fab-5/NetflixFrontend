import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Head from "./Header";
import "@testing-library/jest-dom";

// Mocker för Reacts useEffect och localStorage
describe("Head Component, animation effect", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should render the Netflix logo", () => {
    render(<Head />);

    // Kontrollera att logotypen finns i dokumentet
    const logo = screen.getByAltText("Netflix Logo");
    expect(logo).toBeInTheDocument();
  });

  it("should not apply no-scroll if netflixEffectRun is already true", () => {
    // Mocka localStorage så att netflixEffectRun är 'true'
    localStorage.setItem("netflixEffectRun", "true");

    render(<Head />);

    // Kontrollera att no-scroll inte tillämpas när netflixEffectRun är true
    expect(document.body.classList.contains("no-scroll")).toBe(false);
  });

  it("should not have 'netflixEffectRun' in localStorage initially", () => {
    render(<Head />);

    // Kontrollera att 'netflixEffectRun' INTE finns i localStorage vid första render
    expect(localStorage.getItem("netflixEffectRun")).toBeNull();
  });

  it("should set 'netflixEffectRun' to 'true' in localStorage after 5 seconds if not present", () => {
    render(<Head />);

    // Kontrollera att det INTE finns i början
    expect(localStorage.getItem("netflixEffectRun")).toBeNull();

    // Simulera 6 sekunder med fake timers (se till att det överstiger timeout-tiden)
    vi.advanceTimersByTime(6000);

    // Efter 5 sekunder bör 'netflixEffectRun' vara satt till 'true'
    expect(localStorage.getItem("netflixEffectRun")).toBe("true");
  });

  it("should not change 'netflixEffectRun' if it is already 'true'", () => {
    // Mocka att 'netflixEffectRun' redan är satt till 'true' i localStorage
    localStorage.setItem("netflixEffectRun", "true");

    render(<Head />);

    // Kontrollera att det fortfarande är 'true' efter render
    expect(localStorage.getItem("netflixEffectRun")).toBe("true");

    // Simulera 5 sekunder med fake timers för att se att värdet inte ändras
    vi.useFakeTimers();
    vi.advanceTimersByTime(5000);

    // Se till att värdet förblir 'true' efter tiden
    expect(localStorage.getItem("netflixEffectRun")).toBe("true");
  });
});
