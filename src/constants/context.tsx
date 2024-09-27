// Import necessary dependencies
import {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User } from "firebase/auth";
import { fetchMovies, fetchMovieById, addMovie } from "../firebase/firebaseApi"; // Importera dina Firebase API-anrop
import { onAuthStateChanged } from "../firebase/firebaseAuth"; // Importera auth-logik
import { Movie, ContextType } from "./types";

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

  const handleFetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const moviesData = await fetchMovies();
      setMovies(moviesData);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Något gick fel vid hämtning av data");
    } finally {
      setLoading(false);
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
  const handleFetchMovieById = useCallback(
    async (id: string): Promise<Movie | null> => {
      try {
        const fetchedMovie = await fetchMovieById(id);
        setMovie(fetchedMovie); // Sätt movie-staten
        return fetchedMovie;
      } catch (err) {
        console.log(err);
        setError("Kunde inte hämta filmen.");
        return null;
      }
    },
    [],
  );

  // Lägg till en ny film
  const handleAddMovie = async (newMovie: Movie) => {
    try {
      await addMovie(newMovie);
      setSuccess(true); // Markera att operationen lyckades
      setError(null);
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to add new movie. Please try again.");
      setSuccess(false);
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
        user,
        handleFetchMovies, // Exponera användarinformation i Context
        addMovie: handleAddMovie,
        handleFetchMovieById,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
