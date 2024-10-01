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
  addMovie,
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

  // const handleFetchGenres = useCallback(async () => {
  //   const storedUser = sessionStorage.getItem("user");
  //   const user = storedUser ? JSON.parse(storedUser) : null;

  //   if (!user ) return;

  //   try {
  //     const fetchedGenres = await fetchGenres();
  //     setGenres(fetchedGenres || []); // Se till att alltid sätta en tom array om inget hittas
  //   } catch (err) {
  //     console.log("Kunde inte hämta genrer:", err);
  //     setError("Misslyckades med att hämta genrer.");
  //   }
  // }, []);

  // // Använd handleFetchGenres i useEffect
  // useEffect(() => {
  //   handleFetchGenres(); // Hämta genrer vid montering
  // }, [handleFetchGenres]);

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
        setMovie(fetchedMovie);
        return fetchedMovie;
      } catch (err) {
        console.log(err);
        setError("Kunde inte hämta filmen.");
        return null;
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

    if (!user ) return;

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
        success,
        user,
        handleFetchMovies, // Exponera användarinformation i Context
        addMovie: handleAddMovie,
        handleFetchMovieById,
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
