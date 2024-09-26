// Import necessary dependencies
import { createContext, useState, ReactNode, useEffect } from "react";
import { User } from "firebase/auth";
import { fetchMovies, fetchMovieById, addMovie } from "../firebase/firebaseApi"; // Importera dina Firebase API-anrop
import {
  loginUser,
  logoutUser,
  onAuthStateChanged,
} from "../firebase/firebaseAuth"; // Importera auth-logik
import { Movie, ContextType } from "./types";

// Create Context
const MyContext = createContext<ContextType>(null!);

// Create a provider component
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [movie, setMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Hanterar inloggad användare

  // Fetch all movies using Firebase API
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
        setError(null);
      } catch (err) {
        setError("Något gick fel vid hämtning av data");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Ladda användarinformation och favoriter från sessionStorage när komponenten först laddas
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedFavorites = sessionStorage.getItem("favorites");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Återställ användarens data från sessionStorage
    }
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites)); // Återställ favoriter från sessionStorage
    }
  }, []);

  // Lyssna på autentiseringsstatus från Firebase och uppdatera user-state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Sätter användaren om någon är inloggad
        sessionStorage.setItem("user", JSON.stringify(firebaseUser)); // Spara användarinfo i sessionStorage
      } else {
        setUser(null); // Sätter user till null om ingen är inloggad
        sessionStorage.removeItem("user"); // Ta bort användarinfo från sessionStorage
      }
    });
    return () => unsubscribe(); // Rensa lyssnaren när komponenten avmonteras
  }, []);

  // Funktion för att hämta en specifik film
  const handleFetchMovieById = async (id: string): Promise<Movie | null> => {
    try {
      const fetchedMovie = await fetchMovieById(id);
      setMovie(fetchedMovie); // Sätt movie-staten
      return fetchedMovie;
    } catch (err) {
      setError("Kunde inte hämta filmen.");
      return null;
    }
  };

  // Lägg till en ny film
  const handleAddMovie = async (newMovie: Movie) => {
    try {
      await addMovie(newMovie);
      setSuccess(true); // Markera att operationen lyckades
      setError(null);
    } catch (err) {
      setError("Failed to add new movie. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Logga in användaren och spara i sessionsStorage
  const handleLoginUser = async (userCredentials: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { userData } = await loginUser(userCredentials);
      setUser(userData); // Uppdaterar användaren i Context efter lyckad inloggning
      sessionStorage.setItem("user", JSON.stringify(userData)); // Spara användaren i sessionStorage
      setError(null);
    } catch (err) {
      setError("Felaktigt användarnamn eller lösenord");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Logga ut användaren
  const handleLogoutUser = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null); // Sätter användaren till null efter utloggning
      sessionStorage.removeItem("user"); // Ta bort användaren från sessionStorage
    } catch (err) {
      setError("Något gick fel vid utloggning");
    } finally {
      setLoading(false);
    }
  };

  // Lägg till en film i favoriter
  const addFavorite = (movie: Movie) => {
    if (!favorites.find((fav) => fav.title === movie.title)) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);

      // Spara uppdaterade favoriter i sessionStorage
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Ta bort en film från favoriter
  const removeFavorite = (movie: Movie) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.title !== movie.title,
    );
    setFavorites(updatedFavorites);

    // Spara uppdaterade favoriter i sessionStorage
    sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <MyContext.Provider
      value={{
        movies,
        movie,
        favorites,
        loading,
        error,
        success,
        user, // Exponera användarinformation i Context
        addMovie: handleAddMovie,
        loginUser: handleLoginUser,
        logoutUser: handleLogoutUser,
        fetchMovieById: handleFetchMovieById,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
