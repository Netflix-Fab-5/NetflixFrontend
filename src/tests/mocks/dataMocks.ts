// dataMocks.ts

import { Mock } from "vitest";
import { User } from "firebase/auth";
import { vi } from "vitest";

// Mocked movie data
export const mockMovies = {
  movie1: {
    id: "1",
    title: "The Godfather: Part II",
    year: 2010,
    rating: "PG-13",
    actors: [],
    genre: "Drama",
    synopsis: "",
    thumbnail: "",
    isTrending: true,
  },
  movie2: {
    id: "2",
    title: "The Dark Knight",
    year: 2008,
    rating: "PG-13",
    actors: ["Christian Bale", "Heath Ledger"],
    genre: "Action",
    synopsis: "A gripping tale of Gotham's dark knight.",
    thumbnail: "dark-knight-thumbnail.jpg",
    isTrending: true,
  },
  movie3: {
    id: "3",
    title: "Pulp Fiction",
    year: 1994,
    rating: "R",
    actors: ["John Travolta", "Uma Thurman"],
    genre: "Crime",
    synopsis: "Multiple interrelated stories of crime in Los Angeles.",
    thumbnail: "pulp-fiction-thumbnail.jpg",
    isTrending: false,
  },
};

// Mocked genres data
export const mockGenres = ["Drama", "Action", "Crime", "Comedy"];

// Mocked user session data
export const mockUser: User = {
  uid: "12345",
  email: "testuser@mail.com",
  displayName: "Test User",
  emailVerified: true,
  isAnonymous: false,
  phoneNumber: null,
  photoURL: null,
  providerData: [],
  getIdToken: vi.fn().mockResolvedValue("mockToken"),
  getIdTokenResult: vi.fn(),
  refreshToken: "mockRefreshToken",
  toJSON: vi.fn(),
  delete: vi.fn(),
  metadata: {
    lastSignInTime: "2024-01-01T00:00:00.000Z",
    creationTime: "2023-01-01T00:00:00.000Z",
  },
  tenantId: null,
  reload: vi.fn(),
  providerId: "firebase",
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  vi.spyOn(window.sessionStorage, "getItem").mockImplementation(
    (key: string) => {
      if (key === "user") {
        return JSON.stringify(mockUser); // Mock that a user is stored in sessionStorage
      }
      return null;
    },
  );

  vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => {
    // Mock the behavior of saving items in sessionStorage
  });

  vi.spyOn(window.sessionStorage, "removeItem").mockImplementation(() => {
    // Mock the behavior of removing items from sessionStorage
  });
};

// Mock Firebase auth
export const mockFirebaseAuth = () => {
  vi.mock("firebase/auth", () => ({
    getAuth: vi.fn().mockReturnValue({
      currentUser: mockUser,
      signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: mockUser }),
      signOut: vi.fn().mockResolvedValue(undefined),
    }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  }));
};

// Mock Firebase database (movies, genres)
export const mockFirebaseDatabase = (
  mockGet: Mock,
  mockPush: Mock,
  mockRef: Mock,
) => {
  vi.mock("firebase/database", () => ({
    getDatabase: vi.fn(),
    ref: vi.fn(),
    get: vi.fn(),
    push: vi.fn(),
  }));

  // Mock fetchMovies
  mockGet.mockResolvedValueOnce({
    val: () => mockMovies,
  });

  // Mock fetchGenres
  mockGet.mockResolvedValueOnce({
    val: () => ({
      movie1: { genre: "Drama,Action" },
      movie2: { genre: "Action,Crime" },
    }),
  });

  // Mock addMovie
  mockPush.mockImplementation(() => {
    return Promise.resolve();
  });

  // Mock fetchMovieById
  mockRef.mockReturnValue({ val: vi.fn() });
  mockGet.mockResolvedValueOnce({
    val: () => mockMovies.movie1,
  });
};

// Example of mock context value
export const mockContextValue = {
  movies: mockMovies,
  genres: mockGenres,
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  favorites: [],
  loading: false,
  error: null,
  success: true,
  user: mockUser,
  setUser: vi.fn(),
  setError: vi.fn(),
  handleFetchMovies: vi.fn(),
  handleFetchMovieById: vi.fn(),
  handleFetchMovieByTitle: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  filterMoviesByGenre: vi.fn(),
};
