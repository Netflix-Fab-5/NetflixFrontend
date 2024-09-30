import { ref, get, push, set } from "firebase/database";
import { database } from "./firebase";
import { Movie } from "../constants/types";

// Max antal requests per minut
const RATE_LIMIT = 5;
const RATE_LIMIT_TIME_WINDOW = 60 * 1000; // 60 sekunder (1 minut)

// Funktion för att kolla och uppdatera rate limit för en användare
const checkRateLimit = async (userId: string): Promise<boolean> => {
  const rateLimitRef = ref(database, `rateLimit/${userId}`);
  const snapshot = await get(rateLimitRef);
  const userRateLimitData = snapshot.val();

  const currentTime = Date.now();

  if (userRateLimitData) {
    const { lastRequestTime, requestCount } = userRateLimitData;

    // Om tidsfönstret inte har gått ut och användaren har gjort för många requests
    if (
      currentTime - lastRequestTime < RATE_LIMIT_TIME_WINDOW &&
      requestCount >= RATE_LIMIT
    ) {
      return false; // Användaren har överskridit sin gräns
    }

    // Om tidsfönstret har gått ut, återställ räknaren
    if (currentTime - lastRequestTime >= RATE_LIMIT_TIME_WINDOW) {
      await set(rateLimitRef, {
        lastRequestTime: currentTime,
        requestCount: 1,
      });
    } else {
      // Om inom tidsfönstret men under gränsen, uppdatera räknaren
      await set(rateLimitRef, {
        lastRequestTime,
        requestCount: requestCount + 1,
      });
    }
  } else {
    // Om inga tidigare data finns för användaren, skapa ny rate limit
    await set(rateLimitRef, { lastRequestTime: currentTime, requestCount: 1 });
  }

  return true; // Tillåt begäran
};

// Hämtar alla filmer
export const fetchMovies = async (
  userId: string,
): Promise<Record<string, Movie>> => {
  const isAllowed = await checkRateLimit(userId);
  if (!isAllowed) {
    throw new Error("Too many requests. Please try again later.");
  }

  const moviesRef = ref(database, "movies");
  const snapshot = await get(moviesRef);
  const movies = snapshot.val();
  return movies;
};

// Hämtar en film baserat på ID
export const fetchMovieById = async (
  id: string,
  userId: string,
): Promise<Movie | null> => {
  const isAllowed = await checkRateLimit(userId);
  if (!isAllowed) {
    throw new Error("Too many requests. Please try again later.");
  }

  const movieRef = ref(database, `movies/${id}`);
  const snapshot = await get(movieRef);
  const movieData = snapshot.val();

  return movieData ? { ...movieData, id } : null;
};

// Lägger till en ny film
export const addMovie = async (newMovie: Movie, userId: string) => {
  const isAllowed = await checkRateLimit(userId);
  if (!isAllowed) {
    throw new Error("Too many requests. Please try again later.");
  }

  const moviesRef = ref(database, "movies");
  await push(moviesRef, newMovie);
};
