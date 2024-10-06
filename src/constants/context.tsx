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
  deleteMovie,
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

  const handleFetchGenres = useCallback(async function () {
    try {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres || []);
    } catch (err) {
      console.log("Kunde inte hämta genrer:", err);
      setError("Misslyckades med att hämta genrer.");
    }
  }, []);

  const handleFetchMovies = useCallback(async function () {
    const storedUser = sessionStorage.getItem("user"); // Hämta användaren från sessionStorage
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) return; // Kontrollera att användarens UID finns

    setLoading(true);
    try {
      const moviesData = await fetchMovies(); // Hämta filmer
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
  useEffect(
    function () {
      const unsubscribe = onAuthStateChanged(async function (firebaseUser) {
        if (firebaseUser) {
          setUser(firebaseUser); // Sätter användaren om någon är inloggad
          sessionStorage.setItem("user", JSON.stringify(firebaseUser));
          await handleFetchGenres(); // Hämta genrer efter inloggning
        } else {
          setUser(null); // Sätter user till null om ingen är inloggad
          sessionStorage.removeItem("user"); // Ta bort användarinfo från sessionStorage
        }
      });
      return () => unsubscribe(); // Rensa lyssnaren när komponenten avmonteras
    },
    [handleFetchGenres],
  );

  // Funktion för att hämta en specifik film
  const handleFetchMovieById = useCallback(async function (
    id: string,
  ): Promise<Movie | null> {
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) return null;

    setLoading(true); // Start loading
    try {
      const fetchedMovie = await fetchMovieById(id);
      setMovie(fetchedMovie);
      return fetchedMovie;
    } catch (err) {
      console.log(err);
      setError("Kunde inte hämta filmen.");
      return null;
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  }, []);

  const handleFetchMovieByTitle = useCallback(async function (
    title: string,
  ): Promise<Movie | null> {
    const storedUser = sessionStorage.getItem("user"); // Hämta användaren från sessionStorage
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) return null; // Kontrollera att användarens UID finns

    setLoading(true); // Start loading
    try {
      const movieData = await fetchMovieByTitle(title); // Fetch movie by title
      setMovie(movieData);
      console.log(movieData);
      return movieData;
    } catch (err) {
      console.log(err);
      setError("No movie found with that title");
      return null;
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  }, []);

  // Denna funktion kommer att filtrera filmer baserat på valda genrer
  const filterMoviesByGenre = function (selectedGenres: string[]): void {
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
  const handleAddMovie = async function (newMovie: Movie) {
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
  const handleEditMovie = async function (
    movieId: string,
    updatedMovie: Movie,
  ) {
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

  // Delete a movie
  const handleDeleteMovie = async function (movieId: string) {
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.uid) {
      setError("User not authenticated."); // User authentication error
      setLoading(false);
      return;
    }

    try {
      await deleteMovie(movieId);
      const updatedMoviesData = await fetchMovies(); // Fetch updated movie list
      setMovies(updatedMoviesData);
      setFilteredMovies(Object.values(updatedMoviesData)); // Update filtered movies if necessary
      setSuccess(true);
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      console.error("Error deleting movie:", err);
      setError("Failed to delete movie. Please try again.");
      setSuccess(false);
    }
  };

  // Lägg till en film i favoriter
  function addFavorite(movie: Movie) {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, movie];
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Spara till sessionStorage
      return updatedFavorites;
    });
  }

  function removeFavorite(movie: Movie) {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((fav) => fav.title !== movie.title);
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Spara till sessionStorage
      return updatedFavorites;
    });
  }

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
        setSuccess,
        user,
        setUser,
        handleFetchMovies, // Exponera användarinformation i Context
        addMovie: handleAddMovie,
        handleFetchMovieById,
        handleFetchMovieByTitle,
        editMovie: handleEditMovie,
        deleteMovie: handleDeleteMovie,
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
