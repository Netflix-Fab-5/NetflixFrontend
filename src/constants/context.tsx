// Import necessary dependencies
import {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User } from "firebase/auth";
import {
  fetchMovies,
  fetchMovieById,
  fetchMovieByTitle,
  addMovie,
  editMovie,
  fetchGenres,
} from "../firebase/firebaseApi"; // Importera dina Firebase API-anrop
import { onAuthStateChanged } from "../firebase/firebaseAuth"; // Importera auth-logik
import { Movie, ContextType } from "./types";

const MyContext = createContext<ContextType>(null!);

// Create a provider component
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [movie, setMovie] = useState<Movie | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const savedFavorites = sessionStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Hanterar inloggad användare

  const handleFetchGenres = useCallback(async () => {
    try {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres || []);
    } catch (err) {
      console.log("Kunde inte hämta genrer:", err);
      setError("Misslyckades med att hämta genrer.");
    }
  }, []);

  useEffect(() => {
    handleFetchGenres(); // Hämta genrer vid montering
  }, [handleFetchGenres]);

  const handleFetchMovies = useCallback(async () => {
    const storedUser = sessionStorage.getItem("user"); // Hämta användaren från sessionStorage
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) return; // Kontrollera att användarens UID finns

    setLoading(true);
    try {
      const moviesData = await fetchMovies(); // Skicka användarens UID
      setMovies(moviesData);
      setFilteredMovies(Object.values(moviesData));
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
      const storedUser = sessionStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.uid) return null;

      try {
        const fetchedMovie = await fetchMovieById(id);
        setLoading(true); // Start loading
        setMovie(fetchedMovie);
        return fetchedMovie;
      } catch (err) {
        console.log(err);
        setError("Kunde inte hämta filmen.");
        return null;
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    },
    [],
  );

  const handleFetchMovieByTitle = useCallback(
    async (title: string): Promise<Movie | null> => {
      const storedUser = sessionStorage.getItem("user"); // Hämta användaren från sessionStorage
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !user.uid) return null; // Kontrollera att användarens UID finns

      try {
        const movieData = await fetchMovieByTitle(title); // Fetch movie by title
        setLoading(true); // Start loading
        setMovie(movieData);
        console.log(movieData);
        return movieData;
      } catch (err) {
        console.log(err);
        setError("No movie found with that title");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Denna funktion kommer att filtrera filmer baserat på valda genrer
  const filterMoviesByGenre = (selectedGenres: string[]): void => {
    if (selectedGenres.length === 0) {
      // Om inga genrer är valda, visa alla filmer
      setFilteredMovies(Object.values(movies));
      return;
    }
    const filtered = Object.values(movies).filter((movie) =>
      selectedGenres.some((genre) => movie.genre.includes(genre)),
    );
    setFilteredMovies(filtered);
  };

  // Lägg till en ny film
  const handleAddMovie = async (newMovie: Movie) => {
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) return;

    try {
      await addMovie(newMovie);
      setSuccess(true);
      setError(null);
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to add new movie. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Update movie in the database using fetch API
  const handleEditMovie = async (movieId: string, updatedMovie: Movie) => {
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) {
      setError("User not authenticated."); // User authentication error
      setLoading(false);
      return;
    }

    try {
      await editMovie(movieId, updatedMovie);
      setSuccess(true);
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      console.error("Error updating movie:", err);
      setError("Failed to update movie. Please try again.");
      setSuccess(false); // Mark as unsuccessful
    }
  };

  // Lägg till en film i favoriter
  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, movie];
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Spara till sessionStorage
      return updatedFavorites;
    });
  };

  const removeFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((fav) => fav.title !== movie.title);
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Spara till sessionStorage
      return updatedFavorites;
    });
  };

  useEffect(() => {
    // Lyssna på förändringar i favorites och hantera eventuell logik här om nödvändigt
  }, [favorites]);

  return (
    <MyContext.Provider
      value={{
        movies,
        movie,
        genres,
        favorites,
        filteredMovies, // Add the missing property to the context value
        loading,
        error,
        setError,
        success,
        user,
        handleFetchMovies, // Exponera användarinformation i Context
        addMovie: handleAddMovie,
        handleFetchMovieById,
        handleFetchMovieByTitle,
        editMovie: handleEditMovie,
        addFavorite,
        removeFavorite,
        filterMoviesByGenre, // Add the missing function to the context value
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
